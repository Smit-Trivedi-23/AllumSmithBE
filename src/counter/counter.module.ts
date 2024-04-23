import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CounterController } from './counter.controller';
import { counterService } from './counter.service';
import { CounterSchema } from './entity/counter.entity';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Counter', schema: CounterSchema }])],
  controllers: [CounterController],
  providers: [counterService],

})
export class CounterModule {}