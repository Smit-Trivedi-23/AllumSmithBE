import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { PurchaseOrderType } from './purchaseorder.enum';
// import { Product } from './entities/product.entity';

@Schema()
export class PurchaseOrderEntry extends Document {
    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Product', required: true })
    product: string
    @Prop()
    requiredQuantity: number
    @Prop({ default: 0 })
    receivedQuantity: number
    @Prop({ enum: PurchaseOrderType, default: PurchaseOrderType.Pending })
    status: PurchaseOrderType
}

@Schema({ timestamps: true })
export class PurchaseOrder extends Document {
    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Vendor', required: true })
    vendor: string;

    @Prop({ type: [PurchaseOrderEntry], required: true })
    products: PurchaseOrderEntry[];

    @Prop({ enum: PurchaseOrderType })
    status: string
}


@Schema()
class PurchaseEntryProduct extends Document {
    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Product', required: true })
    product: string
    @Prop({ default: 0 })
    receivedQuantity: number
    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Branch'})
    branch?: string
}

@Schema({ timestamps: true })
export class PurchaseEntry extends Document {
    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'PurchaseOrder', required: true })
    purchaseOrder: string;

    @Prop({ type: [PurchaseEntryProduct], required: true })
    products: PurchaseEntryProduct[];

}

export const PurchaseOrderSchema = SchemaFactory.createForClass(PurchaseOrder);
export const PurchaseEntrySchema = SchemaFactory.createForClass(PurchaseEntry);
