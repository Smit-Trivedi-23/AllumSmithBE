import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { LargeNumberLike } from 'crypto';
import { StringNullableChain } from 'lodash';
import { Document, Schema as MongooseSchema } from 'mongoose';

export enum OrderStatus {
    PENDING = 'pending',
    PARTIAL = 'partial',
    COMPLETED = 'completed',
}

export enum JobHistoryStatus {
    PENDING = 'pending',
    COMPLETED = 'completed',
}

export class JobHistory {
    coId: string;
    jobId: string;
    jobName: string;
    quantity: number; // 40
    status: JobHistoryStatus
}

export class DeliveryHistory {
    coId: string;
    invoiceId: string; //abc1
    quantity: number; // 50
}

export class ItemSummary {
    @Prop({ type: Number })
    pendingQuantity: number;

    @Prop({ type: Number })
    coatingQuantity: number;

    @Prop({ type: Number })
    deliveredQuantity: number;
}

export class COEntry {

    // @Prop({ type: 'ObjectId', ref: 'CustomerOrder', required: true })
    // COId: string;

    @Prop({ type: 'ObjectId', ref: 'Product', required: true })
    product: string;

    @Prop()
    withoutMaterial?: boolean

    @Prop({ required: true })
    quantity: number; // 50

    @Prop({ type: 'ObjectId', ref: 'Coating' })
    coating?: string;

    @Prop()
    mm?: string;

    @Prop({ type: 'ObjectId', ref: 'Color' })
    color?: string;

    @Prop({ enum: OrderStatus, required: true, default: OrderStatus.PENDING })
    status: OrderStatus;

    @Prop({ type: Number })
    pendingQuantity: number

    @Prop({required: true, default: []})
    jobHistory: JobHistory[];

    @Prop({required: true, default: []})
    deliveryHistory: DeliveryHistory[];

    @Prop()
    itemSummary: ItemSummary;
}

export class wmproducts {
    @Prop()
    product?: string;

    @Prop()
    quantity?: number; // 50

    @Prop({ type: 'ObjectId', ref: 'Coating' })
    coating?: string;

    @Prop()
    mm?: string;

    @Prop({ type: 'ObjectId', ref: 'Color' })
    color?: string;

    @Prop({ enum: OrderStatus,default: OrderStatus.PENDING })
    status: OrderStatus;
}

@Schema({ timestamps: true })
export class CustomerOrder extends Document {
    @Prop({ type: 'ObjectId', ref: 'Customer', required: true })
    customer: string;

    @Prop({ type: [COEntry], required: true })
    entries: COEntry[];

    @Prop()
    wmproducts: wmproducts[];

    @Prop()
    customerOrderNumber?:string
}

export const CustomerOrderSchema = SchemaFactory.createForClass(CustomerOrder);
