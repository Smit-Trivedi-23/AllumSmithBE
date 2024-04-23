import { Controller, Get, Post, Put, Delete, Body, Param, NotFoundException } from '@nestjs/common';
import { VendorService } from './vendor.service';
import { Vendor } from './entities/vendor.entity';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('vendors')
@Controller('vendors')
export class VendorController {
  constructor(private readonly vendorService: VendorService) { }

  @Post()
  async create(@Body() createVendorDto: CreateVendorDto): Promise<Vendor> {
    return this.vendorService.create(createVendorDto);
  }

  @Get()
  async findAll(): Promise<Vendor[]> {
    return this.vendorService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Vendor> {
    const vendor = await this.vendorService.findOne(id);
    if (!vendor) {
      throw new NotFoundException(`Vendor with id ${id} not found`);
    }
    return vendor;
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateVendorDto: CreateVendorDto): Promise<Vendor> {
    const updatedVendor = await this.vendorService.update(id, updateVendorDto);
    if (!updatedVendor) {
      throw new NotFoundException(`Vendor with id ${id} not found`);
    }
    return updatedVendor;
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<Vendor> {
    const deletedVendor = await this.vendorService.remove(id);
    if (!deletedVendor) {
      throw new NotFoundException(`Vendor with id ${id} not found`);
    }
    return deletedVendor;
  }
}
