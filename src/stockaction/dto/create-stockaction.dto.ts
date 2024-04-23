import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEnum, IsNumber, IsString } from 'class-validator';
import { StockActionType } from '../entities/stockaction.entity';

export class StockActionDto {
    @ApiProperty({ description: 'ID of the product', example: '60fd285dfae0ef35684d11d0' })
    @IsNotEmpty()
    @IsString()
    readonly product: string;

    @ApiProperty({ description: 'ID of the branch', example: '60fd285dfae0ef35684d11d0' })
    @IsNotEmpty()
    @IsString()
    readonly branch: string;

    @ApiProperty({ description: 'Quantity of the stock action', example: 10 })
    @IsNotEmpty()
    @IsNumber()
    readonly quantity: number;

    @ApiProperty({ description: 'Type of the stock action (add/sub)', example: 'add' })
    @IsNotEmpty()
    @IsEnum(StockActionType)
    readonly actionType: StockActionType;

    @ApiProperty({ description: 'ID of the purchase order', example: '60fd285dfae0ef35684d11d0' })
    @IsString()
    readonly purchase_order?: string;
}
