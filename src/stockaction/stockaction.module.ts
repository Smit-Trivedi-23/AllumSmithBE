import { Module } from '@nestjs/common';
import { StockActionService } from './stockaction.service';
import { MongooseModule } from '@nestjs/mongoose';
import { StockAction, StockActionSchema } from './entities/stockaction.entity';
import { StockActionController } from './stockaction.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: StockAction.name, schema: StockActionSchema }])],
  controllers: [StockActionController],
  providers: [StockActionService],
})
export class StockactionModule { }
