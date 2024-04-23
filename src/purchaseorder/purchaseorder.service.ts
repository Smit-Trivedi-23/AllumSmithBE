import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { PurchaseEntry, PurchaseOrder } from './entities/purchaseorder.entity';
import { CreatePurchaseOrderDto, ProductDto } from './dto/create-purchaseorder.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CreatePurchaseEntryDto, PurchaseEntryProductDto } from './dto/create-purchaseentry.dto';
import { PurchaseOrderType } from './entities/purchaseorder.enum';
import { PurchaseOrderEntry } from './entities/purchaseorder.entity';

@Injectable()
export class PurchaseOrderService {
  constructor(
    @InjectModel(PurchaseOrder.name) private readonly purchaseOrderModel: Model<PurchaseOrder>,
    @InjectModel(PurchaseEntry.name) private readonly purchaseEntryModel: Model<PurchaseEntry>,
    private eventEmitter: EventEmitter2,
  ) { }

  async create(createPurchaseOrderDto: CreatePurchaseOrderDto): Promise<PurchaseOrder> {
    const createdPurchaseOrder = new this.purchaseOrderModel(createPurchaseOrderDto);
    this.eventEmitter.emit('purchaseorder.created', createdPurchaseOrder);
    return createdPurchaseOrder.save();
  }

  async createPurchaseEntry(POId: string, createPurchaseEntryDto: CreatePurchaseEntryDto) {
    const purchaseOrderEntry = await this.purchaseEntryModel.create({ purchaseOrder: POId, ...createPurchaseEntryDto });
    await purchaseOrderEntry.save();
  }

  async registerPurchaseEntry(POId: string, createPurchaseEntryDto: CreatePurchaseEntryDto): Promise<any> {
    try {
      const { products: orderedProducts }: { products: PurchaseOrderEntry[] } = await this.purchaseOrderModel.findById(POId, 'products');
      console.log('my ordered products', orderedProducts);
      const quantityProducts: PurchaseEntryProductDto[] = []
      for (const { product, requiredQuantity,receivedQuantity,status } of orderedProducts) {
        if (status === PurchaseOrderType.Completed) {
          continue
        }
        const newProduct = createPurchaseEntryDto.products.find((prod) => prod.product.toString() === product.toString())
        console.log('new prods ', newProduct);
        
        if (!newProduct || !newProduct.branch) {
          continue
        }
        if(requiredQuantity - receivedQuantity < newProduct.receivedQuantity) throw new Error('received quantity should not be greater than required quantity')
        const data = {
          product,
          requiredQuantity,
          receivedQuantity: Math.min(requiredQuantity, receivedQuantity + newProduct.receivedQuantity),
          status: requiredQuantity == (receivedQuantity + newProduct.receivedQuantity) ? PurchaseOrderType.Completed : PurchaseOrderType.Partial,
          lastQuantityUpdated: newProduct.receivedQuantity,
          branch: newProduct.branch
        }
        quantityProducts.push(data)
      }
      console.log('for prods', quantityProducts);
        
      const POStatus = quantityProducts.every(({ status }) => status === PurchaseOrderType.Completed) ? PurchaseOrderType.Completed : PurchaseOrderType.Partial;
      const updatedPO = this.purchaseOrderModel.findByIdAndUpdate(POId, { products: quantityProducts, status: POStatus }, { new: true });
      await this.createPurchaseEntry(POId, createPurchaseEntryDto);
      this.eventEmitter.emit('purchaseorder.registerPurchaseEntry', quantityProducts)
      return updatedPO;
    } catch (error) {
      console.log(error.message);
      return error;
    }
    // TODO: Change the map to newly recieved products.
    
  }

  async findAll(): Promise<PurchaseOrder[]> {
    return this.purchaseOrderModel.find().populate('products.product').populate('vendor').exec();
  }

  async findAllPurchaseEntries(POID): Promise<PurchaseEntry[]> {
    return this.purchaseEntryModel.find({ purchaseOrder: new Types.ObjectId(POID) }).populate('products.product', 'name').populate('products.branch', 'name').exec();
  }

  async findOne(id: string): Promise<PurchaseOrder> {
    const purchaseOrder = await this.purchaseOrderModel.findById(id).populate('products.product').populate('vendor').exec();
    if (!purchaseOrder) {
      throw new NotFoundException('Purchase order not found.');
    }
    return purchaseOrder;
  }

  async remove(id: string): Promise<PurchaseOrder> {
    const deletedPurchaseOrder = await this.purchaseOrderModel.findByIdAndDelete(id).exec();
    if (!deletedPurchaseOrder) {
      throw new NotFoundException('Purchase order not found.');
    }
    return deletedPurchaseOrder;
  }
}
