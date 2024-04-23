import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { ColorService } from './color.service';
import { Color } from './entities/color.entity';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('colors')
@Controller('colors')
export class ColorController {
  constructor(private readonly colorService: ColorService) { }

  @Post()
  async create(@Body() createColorDto: Color): Promise<Color> {
    return this.colorService.create(createColorDto);
  }

  @Get()
  async findAll(): Promise<Color[]> {
    return this.colorService.findAll();
  }
  
  @Get('getAnodizeColor')
  async getAnodizeColor(): Promise<Color[]> {
    return this.colorService.getAnodizeColor();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Color> {
    return this.colorService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateColorDto: Color): Promise<Color> {
    return this.colorService.update(id, updateColorDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<Color> {
    return this.colorService.remove(id);
  }
}
