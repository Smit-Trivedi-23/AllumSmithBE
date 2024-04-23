import { IsNotEmpty, IsString, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class ProductDto {

    @ApiProperty({ description: 'Product ID', example: 'ObjectID' })
    @IsNotEmpty()
    @IsString()
    product: string;

    @ApiProperty({ description: 'Quantity of the product', example: 10 })
    @IsNotEmpty()
    requiredQuantity: number;
}

export class CreatePurchaseOrderDto {

    @ApiProperty({ description: 'VendorID', example: 'ObjectID' })
    @IsNotEmpty()
    @IsString()
    readonly vendor: string;

    @ApiProperty({ description: 'Array of products', type: [ProductDto] })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ProductDto)
    readonly products: ProductDto[];
}
