import { Module } from '@nestjs/common';
import { CustomerOrderService } from './customer-order.service';
import { CustomerOrderController } from './customer-order.controller';
import { CustomerOrderSchema } from './entities/customer-order.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { JobSchema } from 'src/job/entities/job.entity';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'CustomerOrder', schema: CustomerOrderSchema }]),
    MongooseModule.forFeature([{ name: 'Job', schema: JobSchema }])
  ],
  controllers: [CustomerOrderController],
  providers: [CustomerOrderService],
})
export class CustomerOrderModule { }
