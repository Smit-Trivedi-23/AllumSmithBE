import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Put,
} from '@nestjs/common';
import { JobWm } from './entities/job.wm.entity';
import { ApiTags } from '@nestjs/swagger';
import { jobWmService } from './job.wm.service';
import { CreateJobWmDto } from './dto/create-jobwm.dto';
import { JobStatus } from 'src/job/entities/job.entity';

@ApiTags('JobWm')
@Controller('jobwm')
export class JobWmController {
  constructor(private readonly jobWmService: jobWmService) {}

  @Post()
  async create(@Body() jobWmDto: CreateJobWmDto): Promise<JobWm> {
    return this.jobWmService.create(jobWmDto);
  }

  @Get()
  async findAll(): Promise<JobWm[]> {
    return this.jobWmService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<JobWm> {
    return this.jobWmService.findOne(id);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<JobWm> {
    return this.jobWmService.remove(id);
  }

  @Put(':id')
  async updateJobWmStatus(
    @Param('id') id: string,
    @Body() jobwmDto: any,
  ): Promise<any> {
    return this.jobWmService.updateJobWmStatus(id, jobwmDto);
  }
}
