import { Module } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { InventoryController } from './inventory.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { InventorySchema } from './entities/inventory.entity';
import { JobSchema } from 'src/job/entities/job.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Inventory', schema: InventorySchema }]),
    MongooseModule.forFeature([{ name: 'Job', schema: JobSchema }])
  ],
  controllers: [InventoryController],
  providers: [InventoryService],
})
export class InventoryModule { }
