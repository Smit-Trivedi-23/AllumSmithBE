import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsArray } from 'class-validator';
import { JobStatus } from 'src/job/entities/job.entity';
export class ProductDetailDto {
  @ApiProperty({ description: 'name of the product', example: 'test_product' })
  @IsString()
  product?: string;

  @ApiProperty({ description: 'quantity of the product', example: 300 })
  @IsNumber()
  quantity?: number;

  @ApiProperty({ description: 'coating id', example: 'id' })
  @IsString()
  coating?: string;

  @ApiProperty({ description: 'color id', example: 'id' })
  @IsString()
  color?: string;
}

export class BatchDto {
  @ApiProperty({ description: 'id of the customer order', example: 'id' })
  @IsString()
  coEntry?: string;

  @ApiProperty({
    description: 'array of the wmproducts',
    example: 'products array',
    type: [ProductDetailDto],
  })
  @IsArray()
  products?: [ProductDetailDto];
}

export class CreateJobWmDto {
  @ApiProperty({ description: 'status of the job', example: JobStatus.PENDING })
  @IsString()
  readonly status?: JobStatus;

  @ApiProperty({ description: 'Batches of the job', type: [BatchDto] })
  @IsArray()
  readonly batch?: BatchDto[];

  @ApiProperty({ description: 'Batches of the job', type: [ProductDetailDto] })
  @IsArray()
  readonly selfProducts?: ProductDetailDto[];

  @ApiProperty({
    description: 'Refers to branch id',
    example: '60fd285dfae0ef35684d11d0',
  })
  @IsString()
  readonly branch?: string;

  @ApiProperty({ description: 'Name of the job', example: 'Job-1' })
  @IsString()
  readonly name?: string;
}
