import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export interface IInventory extends Document {
    createdAt: Date;
    updatedAt: Date;
    product: string;
    quantity: number;
    availableStock: number;
    pickStock: number;
}

@Schema()
export class Inventory extends Document implements IInventory {
    @Prop({ default: () => new Date() })
    createdAt: Date;

    @Prop({ default: () => new Date() })
    updatedAt: Date;

    @Prop({ type: 'ObjectId', ref: 'Product', required: true })
    product: string;

    @Prop({ type: 'ObjectId', ref: 'Branch', required: true })
    branch: string;

    @Prop({ required: true })
    quantity: number;

    @Prop({ default: 0 })
    availableStock: number;

    @Prop({ default: 0 })
    pickStock: number;
}

export const InventorySchema = SchemaFactory.createForClass(Inventory);

// InventorySchema.pre('findOneAndUpdate', (next) => {
//     next();
// })