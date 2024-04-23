import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEnum, IsNumber, IsString } from 'class-validator';

export class B2BTransferDto {
    @ApiProperty({ description: 'ID of the product', example: '60fd285dfae0ef35684d11d0' })
    @IsNotEmpty()
    @IsString()
    readonly product: string;

    @ApiProperty({ description: 'ID of the branch', example: '60fd285dfae0ef35684d11d0' })
    @IsNotEmpty()
    @IsString()
    readonly fromBranch: string;

    @ApiProperty({ description: 'ID of the branch', example: '60fd285dfae0ef35684d11d0' })
    @IsNotEmpty()
    @IsString()
    readonly toBranch: string;

    @ApiProperty({ description: 'Quantity of the stock action', example: 10 })
    @IsNotEmpty()
    @IsNumber()
    readonly quantity: number;
}
