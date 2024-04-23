import { Module } from '@nestjs/common';
import { VendorService } from './vendor.service';
import { VendorController } from './vendor.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { VendorSchema } from './entities/vendor.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Vendor', schema: VendorSchema }]),
  ],
  controllers: [VendorController],
  providers: [VendorService],
})
export class VendorsModule { }
