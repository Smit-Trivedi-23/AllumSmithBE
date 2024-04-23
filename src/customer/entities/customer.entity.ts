import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';

@Schema({ timestamps: true })
export class Customer extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  phone: string;

  @Prop()
  anodize_discount?: number
  
  @Prop()
  coating_discount?: number

  @Prop()
  gst_number?: string;

  @Prop()
  company?: string;

  @Prop()
  address_line1?: string;

  @Prop()
  address_line2?: string;

  @Prop()
  city?: string;

  @Prop()
  state?: string;

  @Prop()
  zipcode?: string;

  @Prop({ default: false })
  isArchive: boolean;

  @Prop({ type: [String] })
  associatedInvoices: string[];

  @Prop({ type: [Array] })
  associatedLedgers: any[];

  @Prop()
  credit_amount: number;

  @Prop()
  pending_amount: number;

  @Prop()
  paid_amount: number;
}

export type ProductDocument = HydratedDocument<Customer>;

export const CustomerSchema = SchemaFactory.createForClass(Customer);
