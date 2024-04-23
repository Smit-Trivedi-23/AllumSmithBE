import { Module } from "@nestjs/common";
import { jobWmService } from "./job.wm.service";
import { MongooseModule } from "@nestjs/mongoose";
import { JobWm,JobWmSchema } from "./entities/job.wm.entity";
import { JobWmController } from "./job.wm.controller";
@Module({
    imports: [
        MongooseModule.forFeature([{name: 'JobWm', schema: JobWmSchema}])
    ],
    providers: [jobWmService],
    controllers: [JobWmController]
})

export class jobWmModule {}