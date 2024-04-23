import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { InvoiceServices } from './invoice.service';
import { invoiceDto } from './dto/create-invoice.dto';
import { Invoice } from './entity/invoice.entity';



@ApiTags('Invoice')
@Controller('invoice')
export class InvoiceController {
    constructor(private readonly invoiceService: InvoiceServices) { }

    @Post()
    async create(@Body() invoiceDto: invoiceDto): Promise<Invoice> {
        return this.invoiceService.create(invoiceDto)
    }

    // @Post('generatePdf')
    // async getInvoicePdf(): Promise<any> {
    //     return this.invoiceService.generatePdf()
    // }

    @Post('generatePDF/:id')
    async generatePdfById(@Param('id') id: string): Promise<any> {
        return this.invoiceService.generatePdfById(id)
    }

    @Get()
    async findAll(): Promise<Invoice[]> {
        return this.invoiceService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<Invoice> {
        return this.invoiceService.findOne(id);
    }

    @Delete(':id')
    async remove(@Param('id') id: string): Promise<Invoice> {
        return this.invoiceService.remove(id)
    }
}