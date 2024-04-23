import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { UtilityInventory } from "./entity/utility-inventory.entity";
import { CreateUtilityInventoryDto, utilityStockActionDto } from "./dto/create-utility-inventory.dto";
import { OnEvent } from "@nestjs/event-emitter";
import { Worker } from "src/workers/entities/workers.entity";


@Injectable()
export class UtilityInventoryService {
    constructor(
        @InjectModel('UtilityInventory') private readonly utilityInventoryModel: Model<UtilityInventory>,
        @InjectModel(Worker.name) private workerModel: Model<Worker>
    ) { }

    async create(utilityInventoryDto: CreateUtilityInventoryDto): Promise<UtilityInventory> {
        const utilityInventory = new this.utilityInventoryModel(utilityInventoryDto)
        return utilityInventory.save()
    }

    async findAll(): Promise<UtilityInventory[]> {
        return this.utilityInventoryModel.find().populate([
            {
                path: 'branch',
                model: 'Branch',
                select: 'name'
            },
            {
                path: 'utility',
                model: 'Utility',
                select: 'name code'
            }
        ]).exec()
    }

    async stockAction(stockaction: utilityStockActionDto): Promise<void> {
        const update = await this.utilityInventoryModel.findOneAndUpdate(
            { utility: stockaction.utility, branch: stockaction.branch },
            { $inc: { quantity: stockaction.quantity }, branch: new Types.ObjectId(stockaction.branch) },
            { new: true, upsert: true }
        )
        console.log(update);
    }

    @OnEvent('usedUtility')
    async updateUtility(jobData: any): Promise<void> {
        
        const worker = await this.workerModel.findById(jobData.worker).exec();
        console.log("worker", worker);
        try {
            const branch = jobData.job.branch
            const utility = jobData.powder
            for (const util of utility) {                
                await this.utilityInventoryModel.findOneAndUpdate(
                    { branch: branch, utility: util.powder },
                    { $inc: { quantity: -(util.powderInKgs) } },
                    { new: true }
                )    
            }
            worker.associatedJobs.push(jobData.job._id);
            await worker.save();
        } catch (error) {
            console.log(error);
        }
    }
}