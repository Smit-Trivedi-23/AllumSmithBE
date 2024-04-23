import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsArray, ArrayNotEmpty, ArrayUnique, IsNumber, Min } from 'class-validator';

export class CreateCoatingDto {
    @ApiProperty({ description: 'Code of the coating', example: 'COAT001' })
    @IsNotEmpty()
    @IsString()
    readonly code: string;

    @ApiProperty({ description: 'Array of color IDs', example: ['60fd285dfae0ef35684d11d0'] })
    @IsNotEmpty()
    @IsArray()
    @ArrayNotEmpty()
    @ArrayUnique()
    readonly colors: string[];

    @ApiProperty({ description: 'Name of the coating', example: 'Glossy' })
    @IsNotEmpty()
    @IsString()
    readonly name: string;

    @ApiProperty({ description: 'Rate of the coating', example: 10.5 })
    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    readonly rate: number;
}
