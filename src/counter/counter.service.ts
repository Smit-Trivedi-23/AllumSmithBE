import { CounterDto } from "./dto/create-counter.dto";
import {  Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Counter } from "./entity/counter.entity";
import { OnEvent } from "@nestjs/event-emitter";
@Injectable()
export class counterService {
    constructor(@InjectModel('Counter') private counterModel: Model<Counter>) { }
    
    async create(counterDto: CounterDto): Promise<Counter>{
        const createdCounter = new this.counterModel(counterDto)
        return await createdCounter.save()
    }

    async getValue(name: string): Promise<Counter>{
        return await this.counterModel.findOne({name: name}).exec()
    }

    async getNextValue(name: string): Promise<Counter>{
        return await this.counterModel.findOneAndUpdate(
            { name: name },
            { $inc: { value: 1 } },
            { new : true, upsert: true}
        )
    }

    @OnEvent('updateCounter')
    async updateCounter(name: string): Promise<any>{
        await this.getNextValue(name)
    }
}