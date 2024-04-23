// branch.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateBranchDto {
    @ApiProperty({ description: 'Name of the branch', example: 'Main Branch' })
    @IsString()
    name: string;

    @ApiProperty({ description: 'First line of the branch address', example: '123 Main Street' })
    @IsString()
    address_line1: string;

    @ApiProperty({ description: 'Second line of the branch address', required: false, example: 'Suite 100' })
    @IsOptional()
    @IsString()
    address_line2?: string;

    @ApiProperty({ description: 'City where the branch is located', example: 'New York' })
    @IsString()
    city: string;

    @ApiProperty({ description: 'State where the branch is located', example: 'NY' })
    @IsString()
    state: string;

    @ApiProperty({ description: 'Zip code of the branch', example: '10001' })
    @IsString()
    zipcode: string;

    @ApiProperty({ description: 'Type of the branch', example: 'Retail' })
    @IsString()
    type: string;

    @ApiProperty({ description: 'Contact phone number of the branch', example: '123-456-7890' })
    @IsString()
    phone: string;

    @ApiProperty({ description: 'Name of the contact person at the branch', required: false, example: 'John Doe' })
    @IsOptional()
    @IsString()
    contact_name?: string;

    @ApiProperty({ description: 'Phone number of the contact person at the branch', required: false, example: '987-654-3210' })
    @IsOptional()
    @IsString()
    contact_phone?: string;

    @ApiProperty({ description: 'Indicates whether the branch is archived', default: false, example: false })
    @IsBoolean()
    @IsOptional()
    isArchive?: boolean;
}
