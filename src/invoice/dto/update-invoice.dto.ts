import { PartialType } from '@nestjs/swagger';
import { invoiceDto } from './create-invoice.dto';
export class UpdateInvoiceDto extends PartialType(invoiceDto) { }