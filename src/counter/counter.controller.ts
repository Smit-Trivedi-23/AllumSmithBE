// counter.controller.ts

import { Body, Controller, Get, Param, Put,Post } from '@nestjs/common';
import { CounterDto } from './dto/create-counter.dto';
import { counterService } from './counter.service';
import { Counter } from './entity/counter.entity';
import { ApiTags } from '@nestjs/swagger';


@ApiTags('Counter')
@Controller('counter')
export class CounterController {
    constructor(private readonly counterService: counterService) { }
    
    @Post()
    async create(@Body() counterDto: CounterDto): Promise<Counter> {
        return this.counterService.create(counterDto)
    }  

    @Get(':name')
    async getCounter(@Param('name') name: string): Promise<Counter> {
        return this.counterService.getValue(name)
    }

    @Put(':name')
    async getNextValue(@Param('name') name: string): Promise<Counter>{
        return this.counterService.getNextValue(name) 
    }  

}
