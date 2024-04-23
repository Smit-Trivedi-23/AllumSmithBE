import { Module } from '@nestjs/common';
import { ColorService } from './color.service';
import { ColorController } from './color.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ColorSchema } from './entities/color.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Color', schema: ColorSchema },
    ])
  ],
  controllers: [ColorController],
  providers: [ColorService],
})
export class ColorModule { }
