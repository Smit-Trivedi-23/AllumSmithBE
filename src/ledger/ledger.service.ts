import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { Ledger } from './entity/ledger.entity';
import { CreateLedgerDto } from './dto/create-ledger.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
@Injectable()
export class LedgerService {
  constructor(
    @InjectModel('Ledger') private readonly ledgerModel: Model<Ledger>,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async create(ledgerDto: CreateLedgerDto): Promise<Ledger> {
    try {
      const ledger: Ledger = await this.ledgerModel
        .findOne({ customer: ledgerDto.customer })
        .exec();
      if (ledger) {
        await this.ledgerModel
          .findOneAndUpdate(
            { customer: ledgerDto.customer },
            {
              $inc: { amount_payable: ledgerDto.amount_payable },
              $set: {
                payment_mode: ledgerDto.payment_mode,
                remarks: ledgerDto.remarks,
              },
            },
            { new: true },
          )
          .exec();
        this.eventEmitter.emit('updateCustomerOnLedger', ledgerDto);
        this.eventEmitter.emit('associateCustomerWithLedger', ledgerDto);
      } else {
        const createdLedger = new this.ledgerModel(ledgerDto);
        await createdLedger.save();
        this.eventEmitter.emit('updateCustomerOnLedger', createdLedger);
        this.eventEmitter.emit('associateCustomerWithLedger', ledgerDto);
        return createdLedger;
      }
    } catch (error) {
      console.log(error);
    }
  }

  async findAll(): Promise<Ledger[]> {
    return this.ledgerModel
      .find()
      .populate([
        {
          path: 'customer',
          model: 'Customer',
          populate: {
            path: 'associatedInvoices',
            model: 'Invoice',
          },
        },
      ])
      .exec();
  }

  async findOne(id: string): Promise<Ledger> {
    return this.ledgerModel
      .findById(id)
      .populate([
        {
          path: 'customer',
          model: 'Customer',
          select: 'name',
        },
      ])
      .exec();
  }

  async remove(id: string): Promise<void> {
    await this.ledgerModel.findByIdAndDelete(id).exec();
  }

  async update(
    id: string,
    ledgerDto: Partial<CreateLedgerDto>,
  ): Promise<Ledger> {
    const updatedLedger = await this.ledgerModel
      .findByIdAndUpdate(id, ledgerDto, { new: true })
      .exec();
    return updatedLedger;
  }
}
