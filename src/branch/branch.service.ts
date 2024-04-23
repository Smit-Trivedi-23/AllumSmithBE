// branch.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Branch, BranchDocument } from './entities/branch.entity';

@Injectable()
export class BranchService {
  constructor(@InjectModel(Branch.name) private branchModel: Model<BranchDocument>) { }

  async findAll(): Promise<Branch[]> {
    return this.branchModel.find().exec();
  }

  async findById(id: string): Promise<Branch | null> {
    return this.branchModel.findById(id).exec();
  }

  async create(createBranchDto: Partial<Branch>): Promise<Branch> {
    const createdBranch = new this.branchModel(createBranchDto);
    return createdBranch.save();
  }

  async update(id: string, updateBranchDto: Partial<Branch>): Promise<Branch | null> {
    return this.branchModel.findByIdAndUpdate(id, updateBranchDto, { new: true }).exec();
  }

  async remove(id: string): Promise<void> {
    await this.branchModel.findByIdAndDelete(id).exec();
  }
}
