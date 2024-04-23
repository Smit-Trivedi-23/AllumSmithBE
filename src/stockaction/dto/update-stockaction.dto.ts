import { PartialType } from '@nestjs/swagger';
import { StockActionDto } from './create-stockaction.dto';

export class UpdateStockactionDto extends PartialType(StockActionDto) { }
