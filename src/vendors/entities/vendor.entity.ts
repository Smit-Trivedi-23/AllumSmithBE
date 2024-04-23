import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export interface IVendor extends Document {
    name: string;
    email: string;
    phone: string;
    gstNumber?: string;
    company?: string;
    addressLine1?: string;
    addressLine2?: string;
    city?: string;
    state?: string;
    zipcode?: string;
    isArchive: boolean;
}

@Schema()
export class Vendor extends Document implements IVendor {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    email: string;

    @Prop({ required: true })
    phone: string;

    @Prop()
    gstNumber?: string;

    @Prop()
    company?: string;

    @Prop()
    addressLine1?: string;

    @Prop()
    addressLine2?: string;

    @Prop()
    city?: string;

    @Prop()
    state?: string;

    @Prop()
    zipcode?: string;

    @Prop({ default: false })
    isArchive: boolean;
}

export const VendorSchema = SchemaFactory.createForClass(Vendor);
