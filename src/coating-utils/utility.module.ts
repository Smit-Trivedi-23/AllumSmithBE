import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UtilityService } from './utility.service';
import { Utility, UtilitySchema } from './entity/utility.entity';
import { UtilityController } from './utility.controller';
@Module({
    imports: [
        MongooseModule.forFeature([{ name: Utility.name, schema: UtilitySchema }])
    ],
    controllers: [UtilityController],
    providers: [UtilityService],
})
export class UtilityModule { }
