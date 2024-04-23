import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsNumber, IsArray, IsObject, ValidateNested } from "class-validator"

// export class detailsDto {
//     @ApiProperty({ description: 'name of coating', example: 'wooden' })
//     @IsString()
//     readonly coating: string;

//     @ApiProperty({ description: 'name of color', example: 'seagreen' })
//     @IsString()
//     readonly color: string;

//     @ApiProperty({ description: 'quantity of the prodcut', example: '500' })
//     @IsNumber()
//     readonly quantity: number
// }

// export class productDto {
//     @ApiProperty({ description: 'products details' })
//     @IsArray()
//     product_name: detailsDto[]
// }

// export class CreateFinishInventoryDto {
//     @ApiProperty({ description: 'map containing product details' })
//     @IsArray()
//     products: productDto[]

//     @ApiProperty({ description: 'id of the branch', example: '65ddd15b9cc860ed6000a83b' })
//     @IsNotEmpty()
//     @IsString()
//     branch: string

//     @ApiProperty({ description: 'type of product', example: 'raw' })
//     @IsString()
//     type: string
// }

export class CreateFinishInventoryDto {
    @ApiProperty({ description: 'product id refers to product', example: 'id' })
    @IsString()
    @IsNotEmpty()
    product: string;

    @ApiProperty({ description: 'coating id refers to coating', example: 'id' })
    @IsString()
    @IsNotEmpty()
    coating: string;

    @ApiProperty({ description: 'color id refers to color', example: 'id' })
    @IsString()
    @IsNotEmpty()
    color: string;

    @ApiProperty({ description: 'quantity of product', example: '10' })
    @IsNumber()
    @IsNotEmpty()
    quantity: number;

    @ApiProperty({ description: 'branch id refers to branch', example: 'id' })
    @IsString()
    @IsNotEmpty()
    branch: string;
}