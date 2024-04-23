import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JobService } from './job.service';
import { JobDto } from './dto/job.dto';
import { Job, JobStatus } from './entities/job.entity';

@ApiTags('Jobs')
@Controller('jobs')
export class JobController {
  constructor(private readonly jobService: JobService) {}

  @Post()
  async create(@Body() jobDto: JobDto): Promise<Job> {
    return this.jobService.create(jobDto);
  }

  @Post('generateJobReceipt/:id')
  async generateJobReceiptPdfById(@Param('id') id: string): Promise<any> {
    return this.jobService.generateJobReceiptPdfById(id);
  }

  @Get()
  async findAll(): Promise<Job[]> {
    return this.jobService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Job> {
    return this.jobService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() jobDto: JobDto): Promise<Job> {
    return this.jobService.update(id, jobDto);
  }

  @Put(':id/updateJobStatus')
  async updateJobStatus(
    @Param('id') id: string,
    @Body()
    jobStatus: {
      status: JobStatus;
      worker: string;
      powder: any[];
    },
  ): Promise<Job> {
    return this.jobService.updateJobStatus(
      id,
      jobStatus.status,
      jobStatus.worker,
      jobStatus.powder
    );
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.jobService.remove(id);
  }
}
