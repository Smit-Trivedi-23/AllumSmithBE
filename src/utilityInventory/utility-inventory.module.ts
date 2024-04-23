import { Module } from '@nestjs/common';
import { UtilityInventoryService } from './utility-inventory.service';
import { UtilityInventoryController } from './utility-inventory.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UtilityInventorySchema } from './entity/utility-inventory.entity';
import { WorkerSchema } from 'src/workers/entities/workers.entity';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: 'UtilityInventory', schema: UtilityInventorySchema }]),
        MongooseModule.forFeature([{ name: 'Worker', schema: WorkerSchema }])
    ],
    controllers: [UtilityInventoryController],
    providers: [UtilityInventoryService]
})

export class UtilityInventoryModule { }