import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export interface IColor extends Document {
    name: string;
    code: number;
}

@Schema()
export class Color extends Document implements IColor {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true, unique: true })
    code: number;

    @Prop()
    type: string
}

export const ColorSchema = SchemaFactory.createForClass(Color);
