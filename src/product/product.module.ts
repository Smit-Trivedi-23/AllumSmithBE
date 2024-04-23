import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductSchema } from './entities/product.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Product', schema: ProductSchema },
      // { name: 'ProductRate', schema: ProductRateSchem }
    ])
  ],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule { }
