import { IsNotEmpty, IsOptional, IsString, IsEmail, IsPhoneNumber, IsBooleanString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateVendorDto {
    @ApiProperty({ description: 'Name of the vendor', example: 'John Doe' })
    @IsNotEmpty()
    @IsString()
    readonly name: string;

    @ApiProperty({ description: 'Email of the vendor', example: 'johndoe@example.com' })
    @IsNotEmpty()
    @IsEmail()
    readonly email: string;

    @ApiProperty({ description: 'Phone number of the vendor', example: '1234567890' })
    @IsNotEmpty()
    @IsPhoneNumber('IN')
    readonly phone: string;

    @ApiProperty({ description: 'GST number of the vendor', example: 'GST12345' })
    @IsOptional()
    @IsString()
    readonly gstNumber?: string;

    @ApiProperty({ description: 'Company of the vendor', example: 'ABC Corporation' })
    @IsOptional()
    @IsString()
    readonly company?: string;

    @ApiProperty({ description: 'Address line 1 of the vendor', example: '123 Main St' })
    @IsOptional()
    @IsString()
    readonly addressLine1?: string;

    @ApiProperty({ description: 'Address line 2 of the vendor', example: 'Apt 101' })
    @IsOptional()
    @IsString()
    readonly addressLine2?: string;

    @ApiProperty({ description: 'City of the vendor', example: 'New York' })
    @IsOptional()
    @IsString()
    readonly city?: string;

    @ApiProperty({ description: 'State of the vendor', example: 'NY' })
    @IsOptional()
    @IsString()
    readonly state?: string;

    @ApiProperty({ description: 'Zip code of the vendor', example: '12345' })
    @IsOptional()
    @IsString()
    readonly zipcode?: string;

    @ApiProperty({ description: 'Flag indicating whether the vendor is archived', example: 'false' })
    @IsOptional()
    @IsBooleanString()
    readonly isArchive?: boolean;
}
