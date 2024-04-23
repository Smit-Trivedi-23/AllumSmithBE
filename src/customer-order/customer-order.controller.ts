import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CustomerOrderService } from './customer-order.service';
import { CreateCustomerOrderDto } from './dto/create-customer-order.dto';
import { UpdateCustomerOrderDto } from './dto/update-customer-order.dto';
import { CustomerOrder } from './entities/customer-order.entity';

@Controller('customer-order')
export class CustomerOrderController {
  constructor(private readonly customerOrderService: CustomerOrderService) { }

  @Post()
  async create(@Body() createCustomerOrderDto: CreateCustomerOrderDto): Promise<CustomerOrder> {
    return this.customerOrderService.create(createCustomerOrderDto);
  }

  @Post('generateReciept/:id')
  async generateRecieptPdf(@Param('id') id: string): Promise<any>{
    return this.customerOrderService.generateReceiptPdfById(id)
  } 

  @Get()
  async findAll(): Promise<CustomerOrder[]> {
    return this.customerOrderService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<CustomerOrder> {
    return this.customerOrderService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateCustomerOrderDto: UpdateCustomerOrderDto): Promise<CustomerOrder> {
    return this.customerOrderService.update(id, updateCustomerOrderDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<CustomerOrder> {
    return this.customerOrderService.remove(id);
  }

}
