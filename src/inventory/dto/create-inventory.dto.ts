import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateInventoryDto {
    @IsNotEmpty()
    readonly product: string;

    @IsNotEmpty()
    readonly branch: string;

    @IsNotEmpty()
    @IsNumber()
    readonly quantity: number;

    @IsNotEmpty()
    @IsNumber()
    readonly availableStock: number;

    @IsNotEmpty()
    @IsNumber()
    readonly pickStock: number;
}
