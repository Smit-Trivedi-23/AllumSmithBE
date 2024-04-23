import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum TransactionType {
  debit = 'debit',
  credit = 'credit',
}

export enum PaymentMode {
  Cash = 'cash',
  Cheque = 'cheque',
  RTGS = 'RTGS',
  UPI = 'upi',
}

@Schema({ timestamps: true })
export class Ledger extends Document {
  @Prop({ type: 'ObjectId', ref: 'Customer' })
  customer?: string;

  @Prop()
  grandTotal?: number;

  @Prop()
  payment_mode?: PaymentMode;

  @Prop()
  remarks?: string;

  @Prop()
  amount_payable?: number;
}

export const ledgerSchema = SchemaFactory.createForClass(Ledger);
