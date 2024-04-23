import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Inventory } from './entities/inventory.entity';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { PurchaseOrder } from 'src/purchaseorder/entities/purchaseorder.entity';
import { OnEvent } from '@nestjs/event-emitter';
import { PurchaseEntryProductDto } from 'src/purchaseorder/dto/create-purchaseentry.dto';
import { B2BTransferDto } from 'src/stockaction/dto/b2btransfer.dto';
import { StockActionDto } from 'src/stockaction/dto/create-stockaction.dto';
import { StockActionType } from 'src/stockaction/entities/stockaction.entity';
import { JobDto } from 'src/job/dto/job.dto';
import { CustomerOrder } from 'src/customer-order/entities/customer-order.entity';
import { Job } from 'src/job/entities/job.entity';

@Injectable()
export class InventoryService {
  constructor(
    @InjectModel('Inventory') private readonly inventoryModel: Model<Inventory>,
    @InjectModel('Job') private readonly jobModel: Model<Inventory>,
  ) {}

  async create(createInventoryDto: CreateInventoryDto): Promise<Inventory> {
    const createdInventory = new this.inventoryModel(createInventoryDto);
    return createdInventory.save();
  }

  async findAll(): Promise<Inventory[]> {
    return this.inventoryModel
      .find()
      .populate('product', 'name')
      .populate('branch', 'name')
      .exec();
  }

  async findQuantity(data: any): Promise<any> {
    try {
      const branch = data.branchId;

      const getProductQuantityPromises = data.products.map(async (product) => {
        return await this.inventoryModel
          .find({ branch: branch, product: product })
          .populate('product')
          .exec();
      });
      const result = await Promise.all(getProductQuantityPromises);
      return result.flat();
    } catch (error) {
      console.log(error);
    }
  }

  @OnEvent('purchaseorder.registerPurchaseEntry')
  async updateInventoryfromPOST(
    quantityUpdatedProducts: PurchaseEntryProductDto[],
  ): Promise<void> {
    if (quantityUpdatedProducts && quantityUpdatedProducts.length > 0) {
      Promise.all(
        quantityUpdatedProducts.map(
          ({ product, lastQuantityUpdated, branch }) =>
            this.inventoryModel.findOneAndUpdate(
              {
                product: new Types.ObjectId(product),
                branch: new Types.ObjectId(branch),
              },
              { $inc: { quantity: lastQuantityUpdated }, branch },
              { new: true, upsert: true },
            ),
        ),
      );
    }
  }

  @OnEvent('stockaction.created')
  async updateInventoryOnStockAction(
    stockActionDto: StockActionDto,
  ): Promise<void> {
    console.log(stockActionDto);
    const quantity =
      stockActionDto.actionType === StockActionType.ADD
        ? stockActionDto.quantity
        : -stockActionDto.quantity;
    const update = await this.inventoryModel.findOneAndUpdate(
      {
        product: new Types.ObjectId(stockActionDto.product),
        branch: new Types.ObjectId(stockActionDto.branch),
      },
      { $inc: { quantity }, branch: new Types.ObjectId(stockActionDto.branch) },
      { new: true, upsert: true },
    );

    console.log(update);
  }

  @OnEvent('stockaction.b2btranfer')
  async updateB2BStockTransfer(b2bTransferDto: B2BTransferDto): Promise<void> {
    await this.inventoryModel.findOneAndUpdate(
      {
        product: new Types.ObjectId(b2bTransferDto.product),
        branch: new Types.ObjectId(b2bTransferDto.fromBranch),
      },
      {
        $inc: { quantity: -b2bTransferDto.quantity },
        branch: new Types.ObjectId(b2bTransferDto.fromBranch),
      },
      { new: true, upsert: true },
    );

    await this.inventoryModel.findOneAndUpdate(
      {
        product: new Types.ObjectId(b2bTransferDto.product),
        branch: new Types.ObjectId(b2bTransferDto.toBranch),
      },
      {
        $inc: { quantity: b2bTransferDto.quantity },
        branch: new Types.ObjectId(b2bTransferDto.toBranch),
      },
      { new: true, upsert: true },
    );
  }

  @OnEvent('job.in_progress')
  async updateProductQuantity(data: any): Promise<void> {
    const job: any = await this.jobModel.findById(data.id).exec();
    console.log('job<<<<<<<<<>>>>,', job);
    try {
      console.log('inventory', job);
      job &&
        job?.batch.length > 0 &&
        job?.batch.map(async (batch) => {
          console.log('batch', batch);

          batch.products.map(async (product) => {
            await this.inventoryModel.findOneAndUpdate(
              { product: product.product, branch: job.branch },
              { $inc: { quantity: -product.quantity } },
              { new: true },
            );
          });
        });
      if (job && job?.selfProducts.length > 0) {
        const updateOperations = job.selfProducts.map(async (product) => {
          const inventoryItem = await this.inventoryModel.findOne({
            branch: job.branch,
            product: product.product,
          });
          if (inventoryItem) {
            inventoryItem.quantity = Math.max(
              0,
              inventoryItem.quantity - product.quantity,
            );
          } else {
            throw new NotFoundException('Item is not present in the inventory');
          }
          return inventoryItem.save();
        });
        await Promise.all(updateOperations);
      }
    } catch (error) {
      console.log(error);
    }
  }
}
