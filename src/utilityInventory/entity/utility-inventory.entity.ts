import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';


@Schema({ timestamps: true })
export class UtilityInventory extends Document {
    @Prop({ type: 'ObjectId', ref: 'Product', required: true })
    utility: string;

    @Prop({ type: 'ObjectId', ref: 'Branch', required: true })
    branch: string;

    @Prop({ required: true })
    quantity: number;

    @Prop()
    availableStock?: number;

    @Prop()
    pickStock?: number;
}

export const UtilityInventorySchema = SchemaFactory.createForClass(UtilityInventory);
