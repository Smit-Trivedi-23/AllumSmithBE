import { IsNotEmpty, IsOptional, IsNumber, IsString, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CustomerDto {
    @ApiProperty({ description: 'Name of the customer', example: 'John Doe' })
    @IsNotEmpty()
    @IsString()
    readonly name: string;

    @ApiProperty({ description: 'Email of the customer', example: 'john@example.com' })
    @IsNotEmpty()
    @IsEmail()
    readonly email: string;

    @ApiProperty({ description: 'Phone number of the customer', example: '+1234567890' })
    @IsNotEmpty()
    @IsString()
    readonly phone: string;

    @ApiProperty({ description: 'Premium discount for the customer', example: 10 })
    @IsOptional()
    @IsNumber()
    readonly anodize_discount?: number;

    @ApiProperty({ description: 'Commercial discount for the customer', example: 10 })
    @IsOptional()
    @IsNumber()
    readonly coating_discount?: number;

    @ApiProperty({ description: 'GST number of the customer', example: 'GST123' })
    @IsOptional()
    @IsString()
    readonly gst_number?: string;

    @ApiProperty({ description: 'Company name of the customer', example: 'ABC Corporation' })
    @IsOptional()
    @IsString()
    readonly company?: string;

    @ApiProperty({ description: 'Address line 1', example: '123 Main Street' })
    @IsOptional()
    @IsString()
    readonly address_line1?: string;

    @ApiProperty({ description: 'Address line 2', example: 'Apt 101' })
    @IsOptional()
    @IsString()
    readonly address_line2?: string;

    @ApiProperty({ description: 'City of the customer', example: 'New York' })
    @IsOptional()
    @IsString()
    readonly city?: string;

    @ApiProperty({ description: 'State of the customer', example: 'NY' })
    @IsOptional()
    @IsString()
    readonly state?: string;

    @ApiProperty({ description: 'Zipcode of the customer', example: '10001' })
    @IsOptional()
    @IsString()
    readonly zipcode?: string;
}
