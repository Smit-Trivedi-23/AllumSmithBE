import { Controller, Get, Post, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateUtilityInventoryDto, utilityStockActionDto } from './dto/create-utility-inventory.dto';
import { UtilityInventory } from './entity/utility-inventory.entity';
import { UtilityInventoryService } from './utility-inventory.service';

@ApiTags('Utility Inventory')
@Controller('utility_inventory')
export class UtilityInventoryController {
    constructor(private readonly utilityInventoryService: UtilityInventoryService) { }

    @Get()
    async findAll(): Promise<UtilityInventory[]> {
        return this.utilityInventoryService.findAll()
    }

    @Post('stockaction')
    async stockaction(@Body() stockaction: utilityStockActionDto): Promise<void> {
        this.utilityInventoryService.stockAction(stockaction)
    }

}