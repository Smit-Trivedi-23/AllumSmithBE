import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsArray, IsNumber, IsString, IsOptional, ArrayNotEmpty, ArrayMinSize, IsBoolean } from "class-validator"


export class createCustomerOrderEntryDto {
    @ApiProperty({ description: 'id referencing to product or name', example: '65e1cd11e0f0e9d34ac99136 or product_1' })
    @IsNotEmpty()
    @IsString()
    readonly product: string;


    @ApiProperty({ description: 'id referencing to coating', example: '65eefc87d89d7dd26a0698fa' })
    @IsString()
    @IsOptional()
    readonly coating: string;

    @ApiProperty({ description: 'id referencing to color', example: '65fac063f0c257653708f98d' })
    @IsString()
    @IsOptional()
    readonly color: string;

    @ApiProperty({ description: 'quantity of the product', example: '150' })
    @IsNotEmpty()
    @IsNumber()
    readonly quantity: number;
    
    @ApiProperty({ description: 'customers product', example: false })
    @IsBoolean()
    readonly withoutMaterial: boolean;

}
export class CreateCustomerOrderDto {
    @ApiProperty({ description: 'id referencing to customer', example: '65e566b65cc308574e139fa9' })
    @IsString()
    @IsNotEmpty()
    customer: string;

    @ApiProperty({ description: 'products array', type: [createCustomerOrderEntryDto] })
    @IsArray()
    @ArrayNotEmpty()
    @ArrayMinSize(1)
    entries: createCustomerOrderEntryDto[];
}