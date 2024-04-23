import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateColorDto {
    @IsNotEmpty()
    readonly name: string;

    @IsNotEmpty()
    @IsNumber()
    readonly code: number;
}
