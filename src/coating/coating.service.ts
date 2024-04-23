import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCoatingDto } from './dto/create-coating.dto';
import { Coating } from './entities/coating.entity';

@Injectable()
export class CoatingService {
  constructor(@InjectModel(Coating.name) private readonly coatingModel: Model<Coating>) { }

  async create(coatingDto: CreateCoatingDto): Promise<Coating> {
    const createdCoating = new this.coatingModel(coatingDto);
    return createdCoating.save();
  }

  async findAll(): Promise<Coating[]> {
    return this.coatingModel.find().populate('colors').exec();
  }

  async findOne(id: string): Promise<Coating> {
    return this.coatingModel.findById(id).populate('colors').exec();
  }

  async update(id: string, coatingDto: CreateCoatingDto): Promise<Coating> {
    return this.coatingModel.findByIdAndUpdate(id, coatingDto, { new: true }).exec();
  }

  async remove(id: string): Promise<void> {
    await this.coatingModel.findByIdAndDelete(id).exec();
  }
}
