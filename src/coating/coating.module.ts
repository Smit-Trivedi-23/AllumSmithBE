import { Module } from '@nestjs/common';
import { CoatingService } from './coating.service';
import { CoatingController } from './coating.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Coating, CoatingSchema } from './entities/coating.entity';

@Module({
  imports: [MongooseModule.forFeature([{ name: Coating.name, schema: CoatingSchema }])],
  controllers: [CoatingController],
  providers: [CoatingService],
})
export class CoatingModule { }
