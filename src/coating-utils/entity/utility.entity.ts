import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Utility extends Document {

    @Prop({ required: true })
    name: string;

    @Prop()
    code: string;

    @Prop({ type: 'ObjectId', ref: 'Branch' })
    branch?: string

    @Prop()
    quantity?: number
}


export const UtilitySchema = SchemaFactory.createForClass(Utility);
