import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum JobStatus {
    PENDING = 'pending',
    IN_PROGRESS = 'in_progress',
    COMPLETED = 'completed',
}

export class ProductDetail {
    @Prop({ type: 'ObjectId', ref: 'Product', required: true })
    product: string;

    @Prop({ required: true })
    quantity: number;

    @Prop({ type: 'ObjectId', ref: 'Coating', required: true })
    coating: string;

    @Prop({ type: 'ObjectId', ref: 'Color', required: true })
    color: string;
}

export class Batch {

    @Prop({ type: 'ObjectId', ref: 'CustomerOrder', required: true })
    coEntry: string;

    @Prop()
    products: ProductDetail[]

}

@Schema({ timestamps: true })
export class Job extends Document {
    @Prop({ enum: JobStatus, required: true, default: JobStatus.PENDING })
    status: JobStatus;

    @Prop({ type: [Batch], required: true })
    batch: Batch[];

    @Prop()
    selfProducts?: [ProductDetail]

    @Prop({ type: 'ObjectId', ref: 'Branch', required: true })
    branch: string;

    @Prop({ required: true })
    name: string;

    @Prop()
    withoutMaterial?: boolean;

    @Prop({ type: 'ObjectId', ref: 'Worker' })
    worker?: string

    @Prop()
    powder?: any[]

    @Prop()
    powderQuantity?: number
}

export const JobSchema = SchemaFactory.createForClass(Job);

JobSchema.post('save', (doc, next) => {
    console.log('presave', doc);
    next();
})
