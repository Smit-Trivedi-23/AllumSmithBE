import { Controller, Get, Post, Body, Put, Param, Delete, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ProductService } from './product.service';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { Readable } from 'stream';
import { createReadStream } from 'fs';
import { CsvUploadDto } from './dto/csv-upload.dto';

@ApiTags('Products')
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) { }

  @Post('uploadcsv')
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CsvUploadDto })
  @UseInterceptors(FileInterceptor('file'))
  async uploadCsv(@UploadedFile() file: any): Promise<Product[]> {
    return this.productService.uploadCsv(Readable.from(file.buffer.toString()));
  }

  @Post()
  async create(@Body() createProductDto: CreateProductDto): Promise<Product> {
    return this.productService.create(createProductDto);
  }

  @Get()
  async findAll(): Promise<Product[]> {
    return this.productService.findAll();
  }

  @Get('getDistinctValues')
  async findAllDistinctProperties(): Promise<Product[]> {
    return this.productService.findAllDistinctProperties();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Product> {
    return this.productService.findById(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateProductDto: CreateProductDto): Promise<Product> {
    return this.productService.update(id, updateProductDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<Product> {
    return this.productService.delete(id);
  }


}
