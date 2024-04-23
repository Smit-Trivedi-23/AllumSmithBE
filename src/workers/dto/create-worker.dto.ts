import { IsNotEmpty, IsEmail, IsOptional, IsNumber, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class WorkerDto {
    @ApiProperty({ description: 'name of the worker', example: 'john' })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({ description: 'Email of the customer', example: 'john@example.com' })
    @IsNotEmpty()
    @IsEmail()
    readonly email: string;

    @ApiProperty({ description: 'Phone number of the customer', example: '+1234567890' })
    @IsNotEmpty()
    @IsString()
    readonly phone: string;

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
