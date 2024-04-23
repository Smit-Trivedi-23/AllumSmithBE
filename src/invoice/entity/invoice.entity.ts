import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose"

export class ProductDetails {
    product?: string;
    color?: string;
    name?: string;
    coatingName?: string;
    coating?: string;
    delieveryQuantity?: number;
    length?: number;
    rate?: number;
    weight?: number;
    coatingDiscount?: number;
    specificProductPrice?: number;
    coatingRate?: number;
    coatingWeight?: number;
    coatingTotal?: number;
    amount?: number;
    totalProductQuantity?: number;
    sgst?: number;
    cgst?: number;
}

@Schema({ timestamps: true })
export class Invoice extends Document {
    @Prop({ type: String })
    customerEmail?: string

    @Prop({ type: String })
    customerPhone?: string

    @Prop({ type: 'ObjectId', ref: 'Customer' })
    customerName?: string;

    @Prop({ type: [ProductDetails] })
    products?: [ProductDetails];

    @Prop()
    alluminiumRate?: number;

    @Prop()
    sendMail?: boolean

    @Prop()
    invoiceProducts: Array<any>

    @Prop({ type: 'ObjectId', ref: 'CustomerOrder' })
    customerOrder_id?: string

    @Prop({ type: Number })
    totalAmount?: number

    @Prop({ type: Number })
    amountBeforeTax?: number

    @Prop()
    invoiceNumber?:string
        
    @Prop()
    gst?: number

    @Prop()
    other_tax?: number

    @Prop()
    finished_weight?: number

    @Prop({ type: String })
    origin_point?: string

    @Prop({ type: String })
    delivery_point?: string

    @Prop()
    send_mail?: boolean;
}

export const InvoiceSchema = SchemaFactory.createForClass(Invoice)
