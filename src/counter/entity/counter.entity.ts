// counter.entity.ts

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Counter extends Document {
  @Prop()
  name: string;

  @Prop({ default: 100001 })
  value: number;
}

export const CounterSchema = SchemaFactory.createForClass(Counter);
