import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { WorkerSchema } from "./entities/workers.entity";
import { WorkerService } from "./workers.service";
import { WorkerController } from "./workers.controller";
@Module({
    imports: [
        MongooseModule.forFeature([{ name: 'Worker', schema: WorkerSchema }])
    ],
    controllers: [WorkerController],
    providers: [WorkerService],
})

export class WorkersModule { }