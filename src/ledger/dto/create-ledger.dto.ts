import { IsNumber, IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PaymentMode, TransactionType } from '../entity/ledger.entity';

export class CreateLedgerDto {
  @ApiProperty({
    description: 'id of customer',
    example: '660a5e8705d54635a2e217ef',
  })
  @IsOptional()
  @IsString()
  customer?: string;

  @ApiProperty({ description: 'total amount', example: 5000 })
  @IsNumber()
  @IsOptional()
  amount_payable?: number;

  @ApiProperty({ description: 'total amount', example: 5000 })
  @IsNumber()
  @IsOptional()
  grandTotal?: number;

  @ApiProperty({ description: 'total amount', example: PaymentMode.Cash })
  @IsString()
  payment_mode?: PaymentMode;

  @ApiProperty({ description: 'total amount', example: 'good work' })
  @IsString()
  @IsOptional()
  remarks?: string;
}
