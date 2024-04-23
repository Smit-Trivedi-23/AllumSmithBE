import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Color } from './entities/color.entity';

@Injectable()
export class ColorService {
  constructor(
    @InjectModel('Color') private readonly colorModel: Model<Color>,
  ) { }

  async create(createColorDto: Color): Promise<Color> {
    const createdColor = new this.colorModel(createColorDto);
    return createdColor.save();
  }

  async getAnodizeColor(): Promise<Color[]>{
    return await this.colorModel.find({type: 'anodize'})
  }

  async findAll(): Promise<Color[]> {
    return this.colorModel.find().exec();
  }

  async findOne(id: string): Promise<Color> {
    const color = await this.colorModel.findById(id).exec();
    if (!color) {
      throw new NotFoundException(`Color with id ${id} not found`);
    }
    return color;
  }

  async update(id: string, updateColorDto: Color): Promise<Color> {
    const existingColor = await this.colorModel.findByIdAndUpdate(id, updateColorDto, { new: true }).exec();
    if (!existingColor) {
      throw new NotFoundException(`Color with id ${id} not found`);
    }
    return existingColor;
  }

  async remove(id: string): Promise<Color> {
    const deletedColor = await this.colorModel.findByIdAndDelete(id).exec();
    if (!deletedColor) {
      throw new NotFoundException(`Color with id ${id} not found`);
    }
    return deletedColor;
  }
}
