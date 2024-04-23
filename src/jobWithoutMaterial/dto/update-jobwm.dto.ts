import { PartialType } from '@nestjs/swagger';
import { CreateJobWmDto } from './create-jobwm.dto';
export class UpdateJobWmDto extends PartialType(CreateJobWmDto) { }
