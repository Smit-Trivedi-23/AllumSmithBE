import { Schema, SchemaFactory, Prop } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema({ timestamps: true })
export class Worker extends Document {
    @Prop({ required: true })
    name: string

    @Prop()
    email: string;

    @Prop({ required: true })
    phone: string;

    @Prop()
    company?: string;

    @Prop()
    address_line1?: string;

    @Prop()
    address_line2?: string;

    @Prop()
    city?: string;

    @Prop()
    state?: string;

    @Prop()
    zipcode?: string;

    @Prop({ default: false })
    isArchive: boolean;

    @Prop()
    pancard?: string

    @Prop()
    associatedJobs: string[]
}

export const WorkerSchema = SchemaFactory.createForClass(Worker);