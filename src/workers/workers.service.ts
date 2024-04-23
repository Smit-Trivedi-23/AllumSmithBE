import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Worker } from './entities/workers.entity';
import { WorkerDto } from './dto/create-worker.dto';

@Injectable()
export class WorkerService {
  constructor(
    @InjectModel('Worker') private readonly workerModel: Model<Worker>,
  ) {}

  async create(workerDto: WorkerDto): Promise<Worker> {
    const createdWorker = new this.workerModel(workerDto);
    await createdWorker.save();
    return createdWorker;
  }

  async findAll(): Promise<Worker[]> {
    return this.workerModel
      .find()
      .populate([
        {
          path: 'associatedJobs',
          model: 'Job',
          select: 'name',
        },
      ])
      .exec();
  }

  async findOne(id: string): Promise<Worker> {
    try {
      const worker = await await this.workerModel
        .findById(id)
        .populate({
          path: 'associatedJobs',
          model: 'Job',
          populate: [
            { path: 'branch', model: 'Branch', select: 'name' },
            { path: 'powder', model: 'Utility', select: 'name' },
          ],
        })
        .exec();
      if (!worker) {
        throw new NotFoundException(`worker with id ${id} not found`);
      }
      return worker;
    } catch (error) {
      console.log(error);
    }
  }

  async remove(id: string): Promise<Worker> {
    const deletedWorker = await this.workerModel.findByIdAndDelete(id).exec();
    if (!deletedWorker) {
      throw new NotFoundException(`worker with id ${id} not found`);
    }
    return deletedWorker;
  }

  async update(id: string, updateWorkerDto: WorkerDto): Promise<Worker> {
    const updatedWorker = await this.workerModel
      .findByIdAndUpdate(id, updateWorkerDto, { new: true })
      .exec();
    if (!updatedWorker) {
      throw new NotFoundException(`worker with id ${id} not found`);
    }
    return updatedWorker;
  }
}
