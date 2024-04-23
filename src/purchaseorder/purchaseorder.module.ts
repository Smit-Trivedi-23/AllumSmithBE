import { Module } from '@nestjs/common';
import { PurchaseOrderService } from './purchaseorder.service';
import { PurchaseOrderController } from './purchaseorder.controller';
import { PurchaseEntry, PurchaseEntrySchema, PurchaseOrder, PurchaseOrderSchema } from './entities/purchaseorder.entity';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: PurchaseOrder.name, schema: PurchaseOrderSchema }]),
    MongooseModule.forFeature([{ name: PurchaseEntry.name, schema: PurchaseEntrySchema }])
  ],
  controllers: [PurchaseOrderController],
  providers: [PurchaseOrderService],
})
export class PurchaseorderModule { }
