import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { UtilityService } from './utility.service';
import { CreateUtilityDto, AddUtilityDto } from './dto/create-utility.dto';
import { ApiTags } from '@nestjs/swagger';
import { Utility } from './entity/utility.entity';

@ApiTags('Utility')
@Controller('utilities')
export class UtilityController {
    constructor(private readonly utilityService: UtilityService) { }

    @Post()
    async create(@Body() createUtilityDto: CreateUtilityDto) {
        return this.utilityService.create(createUtilityDto);
    }

    @Post('addUtility')
    async addUtility(@Body() data: AddUtilityDto): Promise<Utility> {
        return this.utilityService.addUtility(data);
    }

    @Get()
    async findAll() {
        return this.utilityService.findAll();
    }

    @Get(':id')
    async findById(@Param('id') id: string) {
        return this.utilityService.findById(id);
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() updateUtilityDto: CreateUtilityDto) {
        return this.utilityService.update(id, updateUtilityDto);
    }

    @Delete(':id')
    async delete(@Param('id') id: string) {
        return this.utilityService.delete(id);
    }
}
