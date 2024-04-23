import { PartialType } from '@nestjs/mapped-types';
import { CreateUtilityInventoryDto } from './create-utility-inventory.dto';

export class UpdateUtilityInventoryDto extends PartialType(CreateUtilityInventoryDto) { }
