import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateJobWmDto } from './dto/create-jobwm.dto';
import { JobWm } from './entities/job.wm.entity';
import { JobStatus } from 'src/job/entities/job.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class jobWmService {
  constructor(
    @InjectModel('JobWm') private readonly jobWmModel: Model<JobWm>,
    private readonly eventEmitter: EventEmitter2
  ) {}

  async create(jobWmDto: CreateJobWmDto): Promise<JobWm> {
    const jobWm = new this.jobWmModel(jobWmDto);
    await jobWm.save();
    return jobWm;
  }

  async findAll(): Promise<JobWm[]> {
    return this.jobWmModel
      .find()
      .populate([
        {
          path: 'batch.products.coating',
          model: 'Coating',
          select: 'name',
        },
        {
          path: 'batch.products.color',
          model: 'Color',
          select: 'name',
        },
        {
          path: 'batch.coEntry',
          model: 'CustomerOrder',
          select: 'customer',
        },
      ])
      .exec();
  }

  async findOne(id: string): Promise<JobWm> {
    return this.jobWmModel
      .findById(id)
      .populate([
        {
          path: 'batch.products.coating',
          model: 'Coating',
          select: 'name',
        },
        {
          path: 'batch.products.color',
          model: 'Color',
          select: 'name',
        },
        {
          path: 'batch.coEntry',
          model: 'CustomerOrder',
          select: 'customer',
        },
      ])
      .exec();
  }

  async remove(id: string): Promise<JobWm> {
    const deletedJob = await this.jobWmModel.findByIdAndDelete(id).exec();
    return deletedJob;
  }

  async updateJobWmStatus(
    id: string,
    jobwmDto: any,
  ): Promise<JobWm> {
    console.log('my payload', jobwmDto);
    
    try {
      const job = await this.jobWmModel.findById(id).exec();

      if (!job) {
        throw new NotFoundException('Job not found');
      }

      if (job.status === JobStatus.COMPLETED) {
        throw new NotAcceptableException('Job is already completed');
      }

      const updatedJob = await this.jobWmModel
        .findByIdAndUpdate(id, { status: jobwmDto.status }, { new: true })
        .exec();
      
      if (!updatedJob) {
        throw new NotFoundException('Job not found');
      }
      if (jobwmDto.status === JobStatus.IN_PROGRESS) {
        const data = {job: job, status: jobwmDto.status}
        this.eventEmitter.emit('jobwm.update', data)
      }
      if (jobwmDto.status === JobStatus.COMPLETED) {
        console.log('in completed');
        
        const data = {
          job: job,
          worker: jobwmDto.worker,
          powderQuantity: jobwmDto.powderQuantity,
          powder: jobwmDto.powder
        }
        this.eventEmitter.emit('jobwm.update', { job, status: jobwmDto.status, data })
      }
      return updatedJob;
    } catch (error) {
      console.error(error.message);
    }
  }
}
