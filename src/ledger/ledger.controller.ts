import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { LedgerService } from './ledger.service';
import { CreateLedgerDto } from './dto/create-ledger.dto';
import { Ledger } from './entity/ledger.entity';

@ApiTags('Ledger')
@Controller('ledger')
export class LedgerController {
    constructor(private readonly ledgerService: LedgerService) { }

    @Post()
    async create(@Body() ledgerDto: CreateLedgerDto): Promise<Ledger>{
        return this.ledgerService.create(ledgerDto);
    }

    @Get()
    async findAll(): Promise<Ledger[]>{
        return this.ledgerService.findAll()
    }

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<Ledger>{
        return this.ledgerService.findOne(id);
    }

    @Delete(':id')
    async remove(@Param('id') id: string): Promise<void>{
        this.ledgerService.remove(id);
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() ledgerDto: CreateLedgerDto): Promise<Ledger>{
        return this.ledgerService.update(id, ledgerDto);
    }

}
