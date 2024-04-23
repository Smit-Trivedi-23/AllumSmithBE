import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose"
import { ProductType } from "src/product/entities/product-type.enum";

// export interface Details {
//     coating: string;
//     color: string;
//     quantity: number;
// }

// export interface Product {
//     product_name: Details[]
// }

// @Schema({ timestamps: true })
// export class FinishInventory extends Document {

//     @Prop()
//     product: Product[];

//     @Prop({ type: 'ObjectId', ref: 'Branch' })
//     branch: string;

//     @Prop({ default: ProductType.FINISHED })
//     type: string

// }
@Schema({ timestamps: true })
export class FinishInventory extends Document {
    @Prop({ type: 'ObjectId', ref: 'Product' })
    product: string;

    @Prop({ type: 'ObjectId', ref: 'Coating' })
    coating: string;

    @Prop({ type: 'ObjectId', ref: 'Color' })
    color: string;

    @Prop()
    quantity: number;

    @Prop({ type: 'ObjectId', ref: 'Branch' })
    branch: string;
}

export const FinishInventorySchema = SchemaFactory.createForClass(FinishInventory);


/*
    new schema
    product: id,
    coating: id,
    color: id,
    quantity: 3,
    branch: id,

    if all same quantity++
    else new entry
*/