import { IsNotEmpty, IsNumber, IsString, IsOptional, ArrayNotEmpty, ArrayMinSize } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class ProductDto {
    @ApiProperty({ description: 'name of the product', example: 'handle' })
    @IsNotEmpty()
    readonly product: string;

    @ApiProperty({ description: 'color of the product', example: 'blue' })
    @IsOptional()
    @IsString()
    readonly color?: string;

    @ApiProperty({ description: 'coating of the product', example: 'wooden' })
    @IsOptional()
    @IsString()
    readonly coating?: string;

    @ApiProperty({ description: 'quantity of the product', example: 50 })
    @IsOptional()
    @IsNumber()
    readonly delieveryQuantity?: number;

    @ApiProperty({ description: 'length of the product', example: 10 })
    @IsOptional()
    @IsNumber()
    readonly length?: number;

    @ApiProperty({ description: 'rate of the product', example: 500 })
    @IsOptional()
    @IsNumber()
    readonly rate?: number;

    @ApiProperty({ description: 'weight of the product', example: 3 })
    @IsOptional()
    @IsNumber()
    readonly weight?: number;
}

export class invoiceDto {
    @ApiProperty({ description: 'customer email', example: 'example@example.com' })
    @IsString()
    @IsNotEmpty()
    customerEmail: string;

    @ApiProperty({ description: 'customer phone number', example: '1234567890' })
    @IsString()
    @IsNotEmpty()
    customerPhone: string;

    @ApiProperty({ description: 'customer name', example: 'John Doe' })
    @IsString()
    @IsOptional()
    customerName?: string;

    @ApiProperty({ description: 'list of products', type: [ProductDto] })
    @ArrayNotEmpty()
    @ArrayMinSize(1)
    products?: ProductDto[];

    @ApiProperty({ description: 'alluminium rate', example: 100 })
    @IsNumber()
    @IsOptional()
    alluminiumRate?: number;

    @ApiProperty({ description: 'flag to indicate sending mail', example: false })
    @IsNotEmpty()
    sendMail: boolean;

    @ApiProperty({ description: 'coating discount', example: 10 })
    @IsNumber()
    @IsOptional()
    coatingDiscount?: number;

    @ApiProperty({ description: 'customer discount', example: 5 })
    @IsNumber()
    @IsOptional()
    customerDiscount?: number;

    @ApiProperty({ description: 'GST percentage', example: 18 })
    @IsNumber()
    @IsOptional()
    gst?: number;

    @ApiProperty({ description: 'tax', example: 5 })
    @IsNumber()
    @IsOptional()
    tax?: number;

    @ApiProperty({ description: 'finished weight', example: '5kg' })
    @IsString()
    @IsOptional()
    finished_weight?: string;

    @ApiProperty({ description: 'origin point', example: 'Origin' })
    @IsString()
    @IsOptional()
    origin_point?: string;

    @ApiProperty({ description: 'delivery point', example: 'Delivery' })
    @IsString()
    @IsOptional()
    delievery_point?: string;
}
