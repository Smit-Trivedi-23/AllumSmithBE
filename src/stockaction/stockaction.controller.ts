import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { StockActionService } from './stockaction.service';
import { StockAction } from './entities/stockaction.entity';
import { StockActionDto } from './dto/create-stockaction.dto';
import { B2BTransferDto } from './dto/b2btransfer.dto';

@ApiTags('stock-actions')
@Controller('stock-actions')
export class StockActionController {
  constructor(private readonly stockActionService: StockActionService) { }

  @Post()
  async create(@Body() stockActionDto: StockActionDto): Promise<StockAction> {
    return this.stockActionService.create(stockActionDto);
  }

  @Post('b2btransfer')
  async branchtobranchtransfer(@Body() stockActionDto: B2BTransferDto): Promise<StockAction> {
    return this.stockActionService.b2btranfer(stockActionDto);
  }

  @Get()
  async findAll(): Promise<StockAction[]> {
    return this.stockActionService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<StockAction> {
    return this.stockActionService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() stockActionDto: StockActionDto): Promise<StockAction> {
    return this.stockActionService.update(id, stockActionDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.stockActionService.remove(id);
  }
}
