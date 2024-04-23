import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { WorkerService } from './workers.service';
import { WorkerDto } from './dto/create-worker.dto';
import { Worker } from './entities/workers.entity';

@ApiTags('Workers')
@Controller('workers')
export class WorkerController {
    constructor(private readonly workerService: WorkerService) { }

    @Post()
    async create(@Body() workerDto: WorkerDto): Promise<Worker> {
        return this.workerService.create(workerDto)
    }

    @Get()
    async findAll(): Promise<Worker[]> {
        return this.workerService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<Worker> {
        return this.workerService.findOne(id);
    }

    @Delete(':id')
    async remove(@Param('id') id: string): Promise<Worker> {
        return this.workerService.remove(id);
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() workerDto: WorkerDto): Promise<Worker> {
        return this.workerService.update(id, workerDto);
    }
}