import { IsNotEmpty, IsString, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { PurchaseOrderType } from '../entities/purchaseorder.enum';

class ProductDto {

    @ApiProperty({ description: 'Product ID', example: 'ObjectID' })
    @IsNotEmpty()
    @IsString()
    product: string;

    @ApiProperty({ description: 'Received quantity of the product', example: 10 })
    @IsNotEmpty()
    receivedQuantity: number;

    @ApiProperty({ description: 'Branch ID in which the product has been received', example: 'ObjectID' })
    @IsNotEmpty()
    @IsString()
    branch: string;
}

export class PurchaseEntryProductDto extends ProductDto {

    @ApiProperty({ description: 'Received quantity of the product', example: 10 })
    @IsNotEmpty()
    requiredQuantity: number;

    @ApiProperty({ description: 'Received quantity of the product', example: 10 })
    @IsNotEmpty()
    status: PurchaseOrderType;

    lastQuantityUpdated: number;

}

export class CreatePurchaseEntryDto {

    @ApiProperty({ description: 'Array of products', type: [ProductDto] })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ProductDto)
    readonly products: ProductDto[];

}
