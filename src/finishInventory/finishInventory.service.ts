import { Injectable } from "@nestjs/common";
import { Model, Types } from "mongoose";
import { InjectModel } from "@nestjs/mongoose"
import { CreateFinishInventoryDto } from "./dto/create-finishInventory.dto"
import { FinishInventory } from "./entites/finishInventory.entity";
import { OnEvent } from "@nestjs/event-emitter";
import { JobDto } from "src/job/dto/job.dto";
import { ProductType } from "../product/entities/product-type.enum"

@Injectable()
export class FinishInventoryServices {
    constructor(
        @InjectModel('FinishInventory') private readonly finishInventoryModel: Model<FinishInventory>
    ) { }

    async findAll(): Promise<FinishInventory[]> {
        return this.finishInventoryModel.find().populate([
            {
                path: 'product',
                model: 'Product',
                select: 'name'
            },
            {
                path: 'coating',
                model: 'Coating',
                select: 'name'
            },
            {
                path: 'color',
                model: 'Color',
                select: 'name'
            },
            {
                path: 'branch',
                model: 'Branch',
                select: 'name'
            },
        ]).exec()
    }

    async delete(id: string): Promise<void> {
        await this.finishInventoryModel.findByIdAndDelete(id).exec()
    }

    async create(finishInventoryDto: CreateFinishInventoryDto): Promise<FinishInventory> {
        const createdFinishInventory = new this.finishInventoryModel(finishInventoryDto)
        return await createdFinishInventory.save()
    }

    // async create(finishInventoryDto: CreateFinishInventoryDto): Promise<FinishInventory> {
    //     const { products, branch, type } = finishInventoryDto;
    //     const createdFinishInventory = new this.finishInventoryModel({
    //         product: products,
    //         branch,
    //         type,
    //     });
    //     await createdFinishInventory.save();
    //     return createdFinishInventory;
    // }

    // @OnEvent('job.completed')
    // async addProductToFinishinventory(job: JobDto): Promise<FinishInventory[]> {
    //     try {
    //         const finishInventoryPromises = job.batch.map(async batch => {
    //             const { coating, color, product, quantity } = batch;
    //             const branch = job.branch;
    //             const type = ProductType.FINISHED
    //             const finishInventory = new this.finishInventoryModel({ product, coating, branch, color, quantity, type });
    //             return await finishInventory.save();
    //         });
    //         const result = await Promise.all(finishInventoryPromises);
    //         // console.log(result);
    //         return result;
    //     } catch (error) {
    //         console.log(error);
    //     }
    // }

    @OnEvent('addToFinishInventory')
    async pushItemsToFI(data: any): Promise<void> {
        // console.log(data);
        try {
            const branch = data.branch;
            for (const product of data.products) {
                await this.finishInventoryModel.findOneAndUpdate(
                    { product: product.product, branch: branch, coating: product.coating, color: product.color },
                    { $inc: { quantity: product.quantity } },
                    { upsert: true }
                );
            }
        } catch (error) {
            console.log(error);
        }
    }
}


// const dummyData = {
//     batch: [
//         {
//             coEntry: "6602b4ab05287cb21bc4fa98", //id related to customer order
//             products: [
//                 {
//                     product: "id",
//                     quantity: 20,
//                     coating: "premium",
//                     color: "light blue",
//                     branch: "65ddd15b9cc860ed6000a83b"
//                 },
//                 {
//                     name: "id",
//                     quantity: 200,
//                     coating: "id",
//                     color: "id",
//                     branch: "65ddd15b9cc860ed6000a83b"
//                 },

//             ]
//         },
//         {
//             products: [
//                 {
//                     product: "id",
//                     quantity: 100,
//                     coating: "id",
//                     color: "id",
//                     branch: "65ddd15b9cc860ed6000a83b"
//                 },
//             ]
//         }
//     ],
//     name: "Job 1",
//     createdAt: "2024-03-23T09:37:21.128Z",
//     updatedAt: "2024-03-23T09:38:02.551Z",
//     __v: 0
// }