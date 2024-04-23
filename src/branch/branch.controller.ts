// branch.controller.ts
import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBody } from '@nestjs/swagger';
import { BranchService } from './branch.service';
import { CreateBranchDto } from './dto/create-branch.dto';
import { Branch } from './entities/branch.entity';

@ApiTags('Branches')
@Controller('branches')
export class BranchController {
  constructor(private readonly branchService: BranchService) { }

  @ApiOperation({ summary: 'Get all branches' })
  @Get()
  async findAll(): Promise<Branch[]> {
    return this.branchService.findAll();
  }

  @ApiOperation({ summary: 'Get a branch by ID' })
  @ApiParam({ name: 'id', description: 'Branch ID' })
  @Get(':id')
  async findById(@Param('id') id: string): Promise<Branch | null> {
    return this.branchService.findById(id);
  }

  @ApiOperation({ summary: 'Create a new branch' })
  @ApiBody({ type: CreateBranchDto })
  @Post()
  async create(@Body() createBranchDto: CreateBranchDto): Promise<Branch> {
    return this.branchService.create(createBranchDto);
  }

  @ApiOperation({ summary: 'Update a branch by ID' })
  @ApiParam({ name: 'id', description: 'Branch ID' })
  @ApiBody({ type: CreateBranchDto })
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateBranchDto: CreateBranchDto): Promise<Branch | null> {
    return this.branchService.update(id, updateBranchDto);
  }

  @ApiOperation({ summary: 'Delete a branch by ID' })
  @ApiParam({ name: 'id', description: 'Branch ID' })
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.branchService.remove(id);
  }
}