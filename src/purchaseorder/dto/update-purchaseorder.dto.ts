import { PartialType } from '@nestjs/swagger';
import { CreatePurchaseOrderDto } from './create-purchaseorder.dto';

export class UpdatePurchaseorderDto extends PartialType(CreatePurchaseOrderDto) { }
