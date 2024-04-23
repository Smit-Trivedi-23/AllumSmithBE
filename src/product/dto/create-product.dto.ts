import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ProductType } from '../entities/product-type.enum';

export class CreateProductDto {
    @ApiProperty({ description: 'Name of the product', example: 'Widget A' })
    @IsNotEmpty()
    @IsString()
    readonly name: string;

    @ApiProperty({ description: 'Product Code', example: '3001' })
    @IsNotEmpty()
    @IsNumber()
    readonly productCode: number;

    @ApiProperty({ description: 'HSN code of the product', example: '123456' })
    @IsNotEmpty()
    @IsString()
    readonly hsn: string;

    @ApiProperty({ description: 'Rate of the product', example: '100' })
    @IsNumber()
    @IsOptional()
    readonly rate: string;

    @ApiProperty({ description: 'Type of the product', example: 'raw' })
    @IsNotEmpty()
    @IsString()
    readonly type: ProductType;

    @ApiProperty({ description: 'Thickness of the product', example: 10 })
    @IsNotEmpty()
    @IsNumber()
    readonly thickness: number;

    @ApiProperty({ description: 'Length of the product', example: 100 })
    @IsNotEmpty()
    @IsNumber()
    readonly length: number;

    @ApiProperty({ description: 'Weight of the product', example: 5 })
    @IsOptional()
    @IsNumber()
    readonly weight?: number;
}
