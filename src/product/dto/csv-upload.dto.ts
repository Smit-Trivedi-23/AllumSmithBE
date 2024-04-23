import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Readable } from 'stream';

export class CsvUploadDto {
    @ApiProperty({ type: 'string', format: 'binary' })
    @IsNotEmpty()
    file: Readable;
}