import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductModule } from './product/product.module';
import { InventoryModule } from './inventory/inventory.module';
import { ColorModule } from './color/color.module';
import { CoatingModule } from './coating/coating.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { VendorsModule } from './vendors/vendor.module';
import { PurchaseorderModule } from './purchaseorder/purchaseorder.module';
import { BranchModule } from './branch/branch.module';
import { CustomerModule } from './customer/customer.module';
import { StockactionModule } from './stockaction/stockaction.module';
import { JobModule } from './job/job.module';
import { FinishInventoryModule } from './finishInventory/finishInventory.module';
import { CustomerOrderModule } from './customer-order/customer-order.module';
import { WorkersModule } from './workers/workers.module';
import { InvoiceModule } from './invoice/invoice.module';
import { UtilityModule } from './coating-utils/utility.module';
import { UtilityInventoryModule } from './utilityInventory/utility-inventory.module';
import { LedgerModule } from './ledger/ledger.module';
import { jobWmModule } from './jobWithoutMaterial/job.wm.module';
import { CounterModule } from './counter/counter.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb+srv://erpadmin:aVUYhOGYuHSKrnkf@cluster0.iruefqw.mongodb.net/smitalluminiumerpdb?retryWrites=true&w=majority&appName=Cluster0'),
    EventEmitterModule.forRoot(),
    ProductModule,
    InventoryModule,
    ColorModule,
    CoatingModule,
    VendorsModule,
    PurchaseorderModule,
    BranchModule,
    CustomerModule,
    StockactionModule,
    JobModule,
    FinishInventoryModule,
    CustomerOrderModule,
    WorkersModule,
    InvoiceModule,
    UtilityModule,
    UtilityInventoryModule,
    LedgerModule,
    jobWmModule,
    CounterModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
