import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { JobStatus } from 'src/job/entities/job.entity';

export class ProductDetail {
    @Prop()
    product?: string;

    @Prop()
    quantity?: number;

    @Prop({ type: 'ObjectId', ref: 'Coating' })
    coating?: string;

    @Prop({ type: 'ObjectId', ref: 'Color' })
    color?: string;
}

export class Batch {

    @Prop({ type: 'ObjectId', ref: 'CustomerOrder' })
    coEntry?: string;

    @Prop()
    products?: ProductDetail[]

}

@Schema({ timestamps: true })
export class JobWm extends Document {
    @Prop({ enum: JobStatus, default: JobStatus.PENDING })
    status: JobStatus;

    @Prop({ type: [Batch] })
    batch?: Batch[];

    @Prop()
    selfProducts?: [ProductDetail]

    @Prop({ type: 'ObjectId', ref: 'Branch' })
    branch?: string;

    @Prop()
    name?: string;

    @Prop({default: true})
    withoutMaterial?: boolean;

    @Prop({ type: 'ObjectId', ref: 'Worker' })
    worker?: string

    @Prop({ type: 'ObjectId', ref: 'Utility' })
    powder?: string

    @Prop()
    powderQuantity?: number
}

export const JobWmSchema = SchemaFactory.createForClass(JobWm);
