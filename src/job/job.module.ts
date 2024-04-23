import { Module } from '@nestjs/common';
import { JobService } from './job.service';
import { JobController } from './job.controller';
import { Job, JobSchema } from './entities/job.entity';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Job.name, schema: JobSchema }])
  ],
  controllers: [JobController],
  providers: [JobService],
})
export class JobModule { }
