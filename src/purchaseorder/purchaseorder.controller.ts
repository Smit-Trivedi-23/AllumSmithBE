import { Controller, Post, Get, Body, ValidationPipe, Param, ParseUUIDPipe, NotFoundException, Delete } from '@nestjs/common';
import { PurchaseOrderService } from './purchaseorder.service';
import { CreatePurchaseOrderDto } from './dto/create-purchaseorder.dto';
import { CreatePurchaseEntryDto } from './dto/create-purchaseentry.dto';
import { PurchaseEntry, PurchaseOrder } from './entities/purchaseorder.entity';
import { ApiTags, ApiCreatedResponse, ApiOkResponse, ApiNotFoundResponse } from '@nestjs/swagger';

@ApiTags('Purchase Order')
@Controller('purchase-order')
export class PurchaseOrderController {
  constructor(private readonly purchaseOrderService: PurchaseOrderService) { }

  @Post()
  @ApiCreatedResponse({ description: 'The purchase order has been successfully created.', type: PurchaseOrder })
  async create(@Body(ValidationPipe) createPurchaseOrderDto: CreatePurchaseOrderDto): Promise<PurchaseOrder> {
    return this.purchaseOrderService.create(createPurchaseOrderDto);
  }

  @Post('registerPurchaseEntry/:id')
  @ApiCreatedResponse({ description: 'Purchase entry', type: PurchaseOrder })
  async registerPurchaseEntry(@Param('id') POId: string, @Body(ValidationPipe) createPurchaseentryDto: CreatePurchaseEntryDto): Promise<PurchaseOrder> {
    return this.purchaseOrderService.registerPurchaseEntry(POId, createPurchaseentryDto);
  }

  @Get()
  @ApiOkResponse({ description: 'List of purchase orders.', type: [PurchaseOrder] })
  async findAll(): Promise<PurchaseOrder[]> {
    return this.purchaseOrderService.findAll();
  }

  @Get('purchaseentry/:id')
  @ApiOkResponse({ description: 'List of purchase orders.', type: [PurchaseOrder] })
  async findAllPurchaseEntries(@Param('id') POId: string): Promise<PurchaseEntry[]> {
    return this.purchaseOrderService.findAllPurchaseEntries(POId);
  }

  @Get(':id')
  @ApiOkResponse({ description: 'The purchase order has been successfully found.', type: PurchaseOrder })
  @ApiNotFoundResponse({ description: 'Purchase order not found.' })
  async findOne(@Param('id') id: string): Promise<PurchaseOrder> {
    const purchaseOrder = await this.purchaseOrderService.findOne(id);
    if (!purchaseOrder) {
      throw new NotFoundException('Purchase order not found.');
    }
    return purchaseOrder;
  }

  @Delete(':id')
  @ApiOkResponse({ description: 'The purchase order has been successfully deleted.', type: PurchaseOrder })
  @ApiNotFoundResponse({ description: 'Purchase order not found.' })
  async remove(@Param('id') id: string): Promise<PurchaseOrder> {
    const purchaseOrder = await this.purchaseOrderService.remove(id);
    if (!purchaseOrder) {
      throw new NotFoundException('Purchase order not found.');
    }
    return purchaseOrder;
  }
}
