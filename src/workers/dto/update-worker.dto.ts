import { PartialType } from '@nestjs/swagger';
import { WorkerDto } from './create-worker.dto';
export class UpdateWorkerDto extends PartialType(WorkerDto) { }