import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreateUtilityDto {
    @ApiProperty({ required: true })
    @IsString()
    name: string;

    @ApiProperty()
    @IsString()
    code: string;
}


export class AddUtilityDto {
    @ApiProperty({ required: true })
    @IsString()
    _id: string;

    @ApiProperty({ required: true })
    @IsString()
    name: string;

    @ApiProperty()
    @IsString()
    code: string;

    @ApiProperty()
    @IsString()
    branch?: string;

    @ApiProperty()
    @IsNumber()
    quantity: number;
}