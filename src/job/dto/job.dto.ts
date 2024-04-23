import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEnum, IsArray, ArrayNotEmpty, ArrayMinSize, IsNumber } from 'class-validator';

enum JobStatus {
    PENDING = 'pending',
    IN_PROGRESS = 'in_progress',
    COMPLETED = 'completed',
}

export class ProductDetailDto {

    @ApiProperty({ description: 'refers to product id', example: '60fd285dfae0ef35684d11d0' })
    @IsNotEmpty()
    @IsString()
    readonly product: string;

    @ApiProperty({ description: 'Quantity of the batch', example: 10 })
    @IsNotEmpty()
    @IsNumber()
    readonly quantity: number;

    @ApiProperty({ description: 'Refers to coating id', example: '60fd285dfae0ef35684d11d0' })
    @IsNotEmpty()
    @IsString()
    readonly coating: string;

    @ApiProperty({ description: 'Refers to color id', example: '60fd285dfae0ef35684d11d0' })
    @IsNotEmpty()
    @IsString()
    readonly color: string;
}

export class BatchDto {

    @ApiProperty({ description: 'Refers to customer order id', example: '6602b4ab05287cb21bc4fa98' })
    @IsNotEmpty()
    @IsString()
    readonly coEntry: string;

    @ApiProperty({ description: 'refers to all the products selected for job', type: [ProductDetailDto] })
    @IsArray()
    readonly products: ProductDetailDto[];

}

export class JobDto {
    @ApiProperty({ description: 'Status of the job', enum: JobStatus, example: 'pending' })
    @IsNotEmpty()
    @IsEnum(JobStatus)
    readonly status: JobStatus;

    @ApiProperty({ description: 'Batches of the job', type: [BatchDto] })
    @IsNotEmpty()
    @IsArray()
    @ArrayNotEmpty()
    @ArrayMinSize(1)
    readonly batch: BatchDto[];

    @ApiProperty({ description: 'Batches of the job', type: [ProductDetailDto] })
    @IsArray()
    readonly selfProducts?: ProductDetailDto[];

    @ApiProperty({ description: 'Refers to branch id', example: '60fd285dfae0ef35684d11d0' })
    @IsNotEmpty()
    @IsString()
    readonly branch: string;

    @ApiProperty({ description: 'Name of the job', example: 'Job-1' })
    @IsNotEmpty()
    @IsString()
    readonly name: string;
}
