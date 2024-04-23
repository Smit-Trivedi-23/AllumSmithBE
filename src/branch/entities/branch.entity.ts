// branch.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';

export type BranchDocument = HydratedDocument<Branch>;

@Schema()
export class Branch {
    @Prop({ type: String, required: true })
    name: string;

    @Prop({ type: String, required: true })
    address_line1: string;

    @Prop({ type: String })
    address_line2: string;

    @Prop({ type: String, required: true })
    city: string;

    @Prop({ type: String, required: true })
    state: string;

    @Prop({ type: String, required: true })
    zipcode: string;

    @Prop({ type: String })
    type: string;

    @Prop({ type: String, required: true })
    phone: string;

    @Prop({ type: Number })
    code: number;

    @Prop({ type: String })
    contact_name: string;

    @Prop({ type: String })
    contact_phone: string;

    @Prop({ type: Boolean, default: false })
    isArchive: boolean;
}

export const BranchSchema = SchemaFactory.createForClass(Branch);
