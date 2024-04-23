import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';

@Schema({ timestamps: true })
export class Coating extends Document {
    @Prop({ required: true, unique: true })
    code: string;

    @Prop({ type: [{ type: 'ObjectId', ref: 'Color' }], required: true })
    colors: string[];

    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    rate: number;

    @Prop()
    type: string
}

export type CoatingDocument = HydratedDocument<Coating>;


export const CoatingSchema = SchemaFactory.createForClass(Coating);
