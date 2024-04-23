import { Controller, Get, Post, Body } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { Inventory } from './entities/inventory.entity';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Inventory')
@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) { }

  @Post()
  async create(@Body() createInventoryDto: CreateInventoryDto): Promise<Inventory> {
    return this.inventoryService.create(createInventoryDto);
  }

  @Get()
  async findAll(): Promise<Inventory[]> {
    return this.inventoryService.findAll();
  }

  @Post('findQuantity')
  async findQuantity(@Body() dummyData: any): Promise<any> {
    return this.inventoryService.findQuantity(dummyData);
  }
}
