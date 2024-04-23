import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { StockActionDto } from './dto/create-stockaction.dto';
import { StockAction, StockActionType } from './entities/stockaction.entity';
import { B2BTransferDto } from './dto/b2btransfer.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class StockActionService {
  constructor(@InjectModel(StockAction.name) private readonly stockActionModel: Model<StockAction>, private eventEmitter: EventEmitter2) { }

  async create(stockActionDto: StockActionDto): Promise<StockAction> {
    const createdStockAction = new this.stockActionModel(stockActionDto);
    this.eventEmitter.emit('stockaction.created', stockActionDto)
    return createdStockAction.save();
  }

  async b2btranfer(b2bTransferDTo: B2BTransferDto): Promise<any> {
    const fromBranch = new this.stockActionModel({ product: b2bTransferDTo.product, branch: b2bTransferDTo.fromBranch, quantity: b2bTransferDTo.quantity, actionType: StockActionType.SUB });
    const toBranch = new this.stockActionModel({ product: b2bTransferDTo.product, branch: b2bTransferDTo.toBranch, quantity: b2bTransferDTo.quantity, actionType: StockActionType.ADD });
    const createdFromBranchRecord = await new this.stockActionModel(fromBranch).save();
    const createdToBranchRecord = await new this.stockActionModel(toBranch).save();
    this.eventEmitter.emit('stockaction.b2btranfer', b2bTransferDTo)
    return { createdFromBranchRecord, createdToBranchRecord };
  }

  async findAll(): Promise<StockAction[]> {
    return this.stockActionModel.find().exec();
  }

  async findOne(id: string): Promise<StockAction> {
    return this.stockActionModel.findById(id).exec();
  }

  async update(id: string, stockActionDto: StockActionDto): Promise<StockAction> {
    return this.stockActionModel.findByIdAndUpdate(id, stockActionDto, { new: true }).exec();
  }

  async remove(id: string): Promise<void> {
    await this.stockActionModel.findByIdAndDelete(id).exec();
  }
}
