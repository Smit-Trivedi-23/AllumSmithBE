import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { FinishInventoryServices } from "./finishInventory.service"
import { FinishInventory } from "./entites/finishInventory.entity";
import { CreateFinishInventoryDto } from "./dto/create-finishInventory.dto";
import { ApiTags } from "@nestjs/swagger";
import { JobDto } from "src/job/dto/job.dto";

@ApiTags('FinishInventory')
@Controller('finish_inventory')
export class FinishInventoryController {
    constructor(private readonly finishInventoryService: FinishInventoryServices) { }

    @Get()
    async findAll(): Promise<FinishInventory[]> {
        return this.finishInventoryService.findAll()
    }

    @Delete(':id')
    async delete(@Param('id') id: string): Promise<void> {
        await this.finishInventoryService.delete(id)
    }

    @Post()
    async createFinishInventory(@Body() finishInventoryDto: CreateFinishInventoryDto): Promise<FinishInventory> {
        return this.finishInventoryService.create(finishInventoryDto)
    }
}