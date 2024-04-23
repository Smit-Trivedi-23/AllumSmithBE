import {
  ForbiddenException,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JobDto } from './dto/job.dto';
import { Job, JobStatus } from './entities/job.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Types } from 'mongoose';
import { readFileSync } from 'fs';
import { generatePDF } from 'src/helper/generatePdf';
import { promises } from 'fs';
import Handlebars from 'handlebars';
@Injectable()
export class JobService {
  constructor(
    @InjectModel(Job.name) private readonly jobModel: Model<Job>,
    private eventEmitter: EventEmitter2,
  ) {}

  async create(jobDto: JobDto): Promise<Job> {
    const createdJob = new this.jobModel(jobDto);
    return createdJob.save();
  }

  async generateReceipt(job: any): Promise<any> {
    Handlebars.registerHelper('inc', function (value) {
      return value + 1;
    });
    Handlebars.registerHelper('calcTotalWeight', function (weight, quantity) {
      const totalWeight = weight * quantity;
      const roundedWeight = totalWeight.toFixed(2);
      return roundedWeight;
    });
    Handlebars.registerHelper('getVersionNumber', function (pdfData) {
      const versionNumber = pdfData ? pdfData.length + 1 : 1;
      return `#${versionNumber}`;
    });
    Handlebars.registerHelper('currentDate', function () {
      const date = new Date();
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    });
    Handlebars.registerHelper(
      'getEstimateWeight',
      function (batch, selfProducts) {
        const batchProductsWeight = batch.reduce((acc: any, curr: any) => {
          const currentBatchProductsWeight = curr.products.reduce(
            (acc: any, curr: any) => {
              const totalWeight = curr.product.weight * curr.quantity;
              return acc + totalWeight;
            },
            0,
          );
          return acc + currentBatchProductsWeight;
        }, 0);
        const selfProductWeight = selfProducts.reduce((acc: any, curr: any) => {
          const totalWeight = curr.product.weight * curr.quantity;
          return acc + totalWeight;
        }, 0);
        return (selfProductWeight + batchProductsWeight).toFixed(2);
      },
    );

    const source = readFileSync('src/helper/job.hbs', 'utf8').toString();

    const template = Handlebars.compile(source);
    await promises.writeFile('jobHTML.html', template(job));

    const generatedReceipt = await generatePDF('jobHTML.html');
    return generatedReceipt;
  }

  async generateJobReceiptPdfById(id: string): Promise<any> {
    const job = await this.jobModel
      .findById(id)
      .populate([
        {
          path: 'branch',
          model: 'Branch',
          select: 'name',
        },
        {
          path: 'batch.products.product',
          model: 'Product',
        },
        {
          path: 'batch.coEntry',
          model: 'CustomerOrder',
          select: 'customer',
          populate: {
            path: 'customer',
            model: 'Customer',
            select: 'name',
          },
        },
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
          path: 'selfProducts.product',
          model: 'Product',
          select: 'name hsn weight productCode',
        },
        {
          path: 'selfProducts.coating',
          model: 'Coating',
          select: 'name',
        },
        {
          path: 'selfProducts.color',
          model: 'Color',
          select: 'name',
        },
      ])
      .lean()
      .exec();

    if (job) {
      const generatedReceipt = await this.generateReceipt(job);
      return generatedReceipt;
    } else {
      throw new NotFoundException(`customer order with ${id} not found`);
    }
  }

  async findAll(): Promise<Job[]> {
    return this.jobModel
      .find()
      .populate([
        {
          path: 'batch.color',
          model: 'Color',
          select: 'name',
        },
        {
          path: 'batch.coating',
          model: 'Coating',
          select: 'name',
        },
      ])
      .exec();
  }

  async updateJobStatus(
    id: string,
    status: JobStatus,
    worker: string,
    powder: any[],
  ): Promise<Job> {
    const oldjob = await this.findOne(id);
    // if (oldjob.status === JobStatus.COMPLETED) {
    //   throw new ForbiddenException('Job is already completed');
    // }
    const job = await this.update(id, { status });
    if (job.status === JobStatus.IN_PROGRESS) {
      this.eventEmitter.emit('job.in_progress', {
        id,
        status,
      });
      // this.eventEmitter.emit('job.in_progress', job);
    }
    if (job.status === JobStatus.COMPLETED) {
      // this.eventEmitter.emit('job.completed', job);
      this.eventEmitter.emit('job.completed', {
        id,
        status,
        powder,
        worker,
      });
    }
    return job;
  }

  async findOne(id: string): Promise<Job> {
    return this.jobModel
      .findById(id)
      .populate([
        {
          path: 'batch.products.product',
          model: 'Product',
          select: 'name',
        },
        {
          path: 'batch.coEntry',
          model: 'CustomerOrder',
          select: 'customer',
          populate: {
            path: 'coEntry.customer',
            model: 'Customer',
            select: 'name'
          }
        },
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
          path: 'selfProducts.product',
          model: 'Product',
          select: 'name',
        },
        {
          path: 'selfProducts.coating',
          model: 'Coating',
          select: 'name',
        },
        {
          path: 'selfProducts.color',
          model: 'Color',
          select: 'name',
        },
      ])
      .exec();
  }

  async update(id: string, jobDto: Partial<JobDto>): Promise<Job> {
    const job = await this.jobModel.findById(id).exec();
    return this.jobModel.findByIdAndUpdate(id, jobDto, { new: true }).exec();
  }

  async remove(id: string): Promise<void> {
    await this.jobModel.findByIdAndDelete(id).exec();
  }
}
