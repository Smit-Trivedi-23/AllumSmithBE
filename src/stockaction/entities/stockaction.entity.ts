import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';

export enum StockActionType {
    ADD = 'add',
    SUB = 'sub',
}

@Schema({ timestamps: true })
export class StockAction extends Document {
    @Prop({ type: 'ObjectId', ref: 'Product', required: true })
    product: string;

    @Prop({ type: 'ObjectId', ref: 'Branch', required: true })
    branch: string;

    @Prop({ required: true })
    quantity: number;

    @Prop({ enum: StockActionType, required: true })
    actionType: string;

    @Prop({ type: 'ObjectId', ref: 'PurchaseOrder' })
    purchase_order: string;
}

export type ProductDocument = HydratedDocument<StockAction>;

export const StockActionSchema = SchemaFactory.createForClass(StockAction);
