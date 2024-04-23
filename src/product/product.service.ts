import { Injectable, NotAcceptableException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { Readable } from 'stream';
import * as csv from 'fast-csv';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel('Product') private readonly productModel: Model<Product>,
    private eventEmitter: EventEmitter2,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const isExist = await this.productModel
      .findOne({ productCode: createProductDto.productCode })
      .exec();
    if (isExist) {
      throw new NotAcceptableException('Product already exist');
    }
    const newProduct = new this.productModel(createProductDto);
    const createdProduct = await newProduct.save();
    this.eventEmitter.emit('product.created', createdProduct);
    return createdProduct;
  }

  async findAll(): Promise<Product[]> {
    return this.productModel.find().exec();
  }

  async findAllDistinctProperties(): Promise<any> {
    const [length, thickness, weight] = await Promise.all(
      ['length', 'thickness', 'weight'].map((property) =>
        this.productModel.distinct(property),
      ),
    );
    return { length, thickness, weight };
  }

  async findById(id: string): Promise<Product> {
    return this.productModel.findById(id).exec();
  }

  async update(
    id: string,
    updateProductDto: CreateProductDto,
  ): Promise<Product> {
    return this.productModel
      .findByIdAndUpdate(id, updateProductDto, { new: true })
      .exec();
  }

  @OnEvent('product.created')
  handleOrderCreatedEvent(payload: any): void {
    console.log('new product created');
    // handle and process "OrderCreatedEvent" event
  }

  async delete(id: string): Promise<Product> {
    return this.productModel.findByIdAndDelete(id).exec();
  }

  async uploadCsv(file: Readable): Promise<Product[]> {
    const products: Product[] = [];
    return new Promise((resolve, reject) => {
      const csvStream = csv.parse({ headers: true });
      csvStream
        .on('data', (data) => {
          try {
            const productData = {
              name: data.name,
              hsn: data.hsn,
              type: data.type,
              thickness: data.thickness,
              length: data.length,
              weight: data.weight,
            };
            const product = new this.productModel(productData); // Create a new Product instance and set its properties from CSV data
            products.push(product); // Add the product to the array
          } catch (err) {
            console.log('error reading row in csv', data);
          }
        })
        .on('end', () => {
          this.productModel.bulkSave(products);
          resolve(products); // Resolve with the array of products
        })
        .on('error', (error) => {
          reject(error); // Reject with the error if any
        });
      // Pipe the file stream into the CSV parser
      file.pipe(csvStream);
    });
  }
}
