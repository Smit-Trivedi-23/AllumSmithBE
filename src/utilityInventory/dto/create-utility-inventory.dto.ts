import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateUtilityInventoryDto {
    @ApiProperty({ description: 'utility id refers to utility', example: '65ddd15b9cc860ed6000a83b' })
    @IsNotEmpty()
    @IsString()
    readonly utility: string;

    @ApiProperty({ description: 'branch id refers to utility', example: '65ddd15b9cc860ed6000a83b' })
    @IsNotEmpty()
    @IsString()
    readonly branch: string;

    @ApiProperty({ description: 'quantity of utility', example: '65' })
    @IsNotEmpty()
    @IsNumber()
    readonly quantity: number;

    @IsNumber()
    readonly availableStock?: number;

    @IsNumber()
    readonly pickStock?: number;
}

export class utilityStockActionDto {
    @ApiProperty({ description: 'branch id refers to branch', example: '65ddd15b9cc860ed6000a83b' })
    @IsString()
    readonly branch: string

    @ApiProperty({ description: 'quantity of the utility', example: '65' })
    @IsNumber()
    readonly quantity: number

    @ApiProperty({ description: 'utility id refers to utility', example: '65ddd15b9cc860ed6000a83b' })
    @IsString()
    readonly utility: string
}