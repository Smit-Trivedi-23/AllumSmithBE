import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CustomerService } from './customer.service';
import { CustomerDto } from './dto/create-customer.dto';
import { Customer } from './entities/customer.entity';

@ApiTags('customers')
@Controller('customers')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) { }

  @Post()
  async create(@Body() customerDto: CustomerDto): Promise<Customer> {
    return this.customerService.create(customerDto);
  }

  @Get()
  async findAll(): Promise<Customer[]> {
    return this.customerService.findAll();
  }

  @Get('getAllInvoiceOfCustomer/:id')
  async getAllInvoiceOfCustomer(@Param('id') id: string): Promise<any>{
    return this.customerService.getAllInvoiceOfCustomer(id);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Customer> {
    return this.customerService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() customerDto: CustomerDto): Promise<Customer> {
    return this.customerService.update(id, customerDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.customerService.remove(id);
  }
}
