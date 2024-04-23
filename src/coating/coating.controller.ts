import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CoatingService } from './coating.service';
import { CreateCoatingDto } from './dto/create-coating.dto';
import { Coating } from './entities/coating.entity';

@ApiTags('coatings')
@Controller('coatings')
export class CoatingController {
  constructor(private readonly coatingService: CoatingService) { }

  @Post()
  async create(@Body() coatingDto: CreateCoatingDto): Promise<Coating> {
    return this.coatingService.create(coatingDto);
  }

  @Get()
  async findAll(): Promise<Coating[]> {
    return this.coatingService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Coating> {
    return this.coatingService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() coatingDto: CreateCoatingDto): Promise<Coating> {
    return this.coatingService.update(id, coatingDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.coatingService.remove(id);
  }
}
