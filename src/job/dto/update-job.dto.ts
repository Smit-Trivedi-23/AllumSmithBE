import { PartialType } from '@nestjs/swagger';
import { JobDto } from './job.dto';

export class UpdateJobDto extends PartialType(JobDto) { }
