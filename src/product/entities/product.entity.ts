import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Document } from 'mongoose';
import { ProductType } from './product-type.enum';

export interface IProduct extends Document {
    createdAt: Date;
    updatedAt: Date;
    name: string;
    hsn: string;
    type: ProductType;
    thickness: number;
    length: number;
    weight?: number;
    isArchive: boolean;
}

@Schema()
export class Product extends Document implements IProduct {
    @Prop({ default: () => new Date() })
    createdAt: Date;

    @Prop({ default: () => new Date() })
    updatedAt: Date;

    @Prop({ required: true })
    name: string;

    @Prop({ type: Number, unique: true, required: true })
    productCode: string;

    @Prop({ required: true })
    hsn: string;

    @Prop({ type: Number })
    rate: string;

    @Prop({ required: true, enum: ['raw', 'finished'], default: 'raw' })
    type: ProductType;

    @Prop()
    thickness: number;

    @Prop({ required: true })
    length: number;

    @Prop()
    weight?: number;

    @Prop({ default: false })
    isArchive: boolean;

}

export type ProductDocument = HydratedDocument<Product>;

export const ProductSchema = SchemaFactory.createForClass(Product);
