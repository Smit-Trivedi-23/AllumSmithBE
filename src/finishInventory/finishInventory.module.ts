import { Module } from "@nestjs/common";
import { FinishInventoryServices } from "./finishInventory.service";
import { FinishInventoryController } from "./finishInventory.controller";
import { FinishInventorySchema } from "./entites/finishInventory.entity";
import { MongooseModule } from "@nestjs/mongoose";
import { ProductSchema } from "src/product/entities/product.entity";

@Module({
    imports: [
        MongooseModule.forFeature([{ name: 'FinishInventory', schema: FinishInventorySchema }])
    ],
    controllers: [FinishInventoryController],
    providers: [FinishInventoryServices]
})
export class FinishInventoryModule { }