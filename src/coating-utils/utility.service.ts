import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Utility } from './entity/utility.entity';
import { CreateUtilityDto, AddUtilityDto } from './dto/create-utility.dto';

@Injectable()
export class UtilityService {
    constructor(
        @InjectModel(Utility.name) private utilityModel: Model<Utility>
    ) { }

    async create(createUtilityDto: CreateUtilityDto): Promise<Utility> {
        const createdUtility = new this.utilityModel(createUtilityDto);
        return createdUtility.save();
    }

    async addUtility(data: AddUtilityDto): Promise<Utility> {
        console.log("existing data", data);
        const utility = await this.utilityModel.findOne({ branch: data.branch, _id: data._id })
        if (utility) {
            utility.quantity += data.quantity
            return await utility.save()
        } else {
            const newUtility = {
                name: data.name,
                code: data.code,
                branch: data.branch,
                quantity: data.quantity
            }
            const createdUtility = new this.utilityModel(newUtility);
            return await createdUtility.save();
        }
    }

    async findAll(): Promise<Utility[]> {
        return this.utilityModel.find().populate([
            {
                path: 'branch',
                model: 'Branch',
                select: 'name'
            }
        ]).exec();
    }

    async findById(id: string): Promise<Utility> {
        return this.utilityModel.findById(id).exec();
    }

    async update(id: string, updateUtilityDto: CreateUtilityDto): Promise<Utility> {
        return this.utilityModel.findByIdAndUpdate(id, updateUtilityDto, { new: true }).exec();
    }

    async delete(id: string): Promise<Utility> {
        return this.utilityModel.findByIdAndDelete(id).exec();
    }

    // @OnEvent('usedUtility')
    // async updateUtility(newJob: any): Promise<void> {
    //     console.log("job utility", newJob);
    //     let worker: Worker = await this.workerModel.findById(newJob.worker)
    //     console.log("current worker", worker);

    //     try {
    //         const branch = newJob.job.branch;
    //         const powder = newJob.powder;
    //         console.log("branch and powder", branch, powder);

    //         await this.utilityModel.findOneAndUpdate(
    //             { branch: branch, _id: powder },
    //             { $inc: { quantity: -(newJob.powderQuantity) } },
    //             { new: true }
    //         )
    //         console.log("powder updated");
    //         worker.associatedJobs.push(newJob.job._id)
    //         await worker.save();
    //         console.log("updated worker", worker);

    //     } catch (error) {
    //         console.log(error);
    //     }
    // }
}
