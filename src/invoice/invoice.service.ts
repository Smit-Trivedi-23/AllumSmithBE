import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Invoice } from './entity/invoice.entity';
import { invoiceDto } from './dto/create-invoice.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Coating } from 'src/coating/entities/coating.entity';
import Handlebars from 'handlebars';
import { readFileSync } from 'fs';
import { promises } from 'fs';
import { generatePDF } from 'src/helper/generatePdf';
import { numberToWords } from 'src/helper/numberToWords';
import { groupBy } from 'lodash';
// import { wordify } from 'src/helper/numberToWords';
@Injectable()
export class InvoiceServices {
  constructor(
    @InjectModel('Invoice') private readonly invoiceModel: Model<Invoice>,
    @InjectModel('Invoice') private readonly coatingModel: Model<Coating>,
    private eventEmiiter: EventEmitter2,
  ) {}

  async create(invoiceDto: invoiceDto): Promise<any> {
    try {
      const createdInvoice = new this.invoiceModel(invoiceDto);
      this.filterProductsArrayAndCoating(createdInvoice);
      await createdInvoice.save();
      this.eventEmiiter.emit('updateDelieveryQuantity', createdInvoice);
      this.eventEmiiter.emit('associateInvoiceWithCustomer', createdInvoice);
      this.eventEmiiter.emit('updateCounter', 'invoiceCounter');
      return createdInvoice;
    } catch (error) {
      console.error(error);
    }
  }

  async findAll(): Promise<Invoice[]> {
    try {
      return this.invoiceModel
        .find()
        .populate([
          {
            path: 'customerName',
            model: 'Customer',
          },
          {
            path: 'products.product',
            model: 'Product',
            select: 'rate code name',
          },
          {
            path: 'products.color',
            model: 'Color',
            select: 'name',
          },
          {
            path: 'products.coating',
            model: 'Coating',
            select: 'name rate',
          },
        ])
        .exec();
    } catch (error) {
      console.error(error);
    }
  }

  async generatePdf(invoice: any): Promise<any> {
    Handlebars.registerHelper('inc', function (value, options) {
      return parseInt(value) + 1;
    });
    Handlebars.registerHelper(
      'calcTotalWeight',
      function (weight, delieveryQuantity) {
        return weight * delieveryQuantity;
      },
    );
    Handlebars.registerHelper('getVersionNumber', function (pdfData) {
      const versionNumber = pdfData ? pdfData.length + 1 : 1;
      return `#${versionNumber}`;
    });
    Handlebars.registerHelper(
      'calculateAmount',
      function (rate, delieveryQuantity, weight) {
        return rate * delieveryQuantity * weight;
      },
    );
    Handlebars.registerHelper('numberToWords', function (totalAmount) {
      const num = Math.ceil(totalAmount);
      return numberToWords(num);
    });
    Handlebars.registerHelper('calcAmountBeforeTax', function (tax, amount) {
      const myAmount = (amount * tax) / 100;
      return myAmount.toFixed(2);
    });
    Handlebars.registerHelper('calculateSum', function (gst, amount) {
      let gstAmount = (amount * (gst / 2)) / 100;
      return (gstAmount * 2).toFixed(2);
    });
    Handlebars.registerHelper(
      'calculateGstSum',
      function (invoiceProducts, gst) {
        return invoiceProducts
          .reduce((acc: number, curr: any) => {
            let myGst =
              ((curr.specificProductPrice || curr.coatingTotal) * (gst / 2)) /
              100;
            return acc + myGst;
          }, 0)
          .toFixed(2);
      },
    );
    Handlebars.registerHelper('getCgstAndSgst', function (gst) {
      return (gst / 2).toFixed(2);
    });
    Handlebars.registerHelper(
      'calculatetotalGstSum',
      function (invoiceProducts, gst) {
        return (
          invoiceProducts.reduce((acc: number, curr: any) => {
            let myGst =
              ((curr.specificProductPrice || curr.coatingTotal) * (gst / 2)) /
              100;
            return acc + myGst;
          }, 0) * 2
        ).toFixed(2);
      },
    );
    Handlebars.registerHelper('calculateAmountForGST', function (value, gst) {
      let myGst = gst / 2;
      return ((value * myGst) / 100).toFixed(2);
    });
    Handlebars.registerHelper(
      'calculateAmounBeforeTAX',
      function (invoiceProducts) {
        return invoiceProducts.reduce((acc: number, curr: any) => {
          return acc + (curr.specificProductPrice || curr.coatingTotal);
        }, 0);
      },
    );
    Handlebars.registerHelper('getDate', function () {
      const date = new Date();
      const dd = date.getDate().toLocaleString().padStart(2, '');
      const mm = date.getMonth() + 1;
      const yyyy = date.getFullYear();
      return `${dd}-${mm}-${yyyy}`;
    });

    const source = readFileSync('src/helper/index.hbs', 'utf8').toString();

    const template = Handlebars.compile(source);
    await promises.writeFile('invoiceHTML.html', template(invoice));

    const generatedPdf = await generatePDF('invoiceHTML.html');

    return generatedPdf;
  }

  async generatePdfById(id: string): Promise<any> {
    console.log('invoice id', id);
    const invoice = await this.invoiceModel
      .findById(id)
      .populate([
        {
          path: 'customerName',
          model: 'Customer',
        },
        {
          path: 'invoiceProducts.product',
          model: 'Product',
        },
        {
          path: 'invoiceProducts.coating',
          model: 'Coating',
          select: 'code name',
        },
        {
          path: 'invoiceProducts.color',
          model: 'Color',
          select: 'name',
        },
      ])
      .lean()
      .exec();
    console.log('invoice1234', invoice);

    if (invoice) {
      console.log('Invoice54321', invoice.invoiceProducts);

      const generatedPdf = await this.generatePdf(invoice);
      console.log('pdf that is generated', generatedPdf);
      return generatedPdf;
    } else {
      throw new NotFoundException(`invoice with id ${id} not found`);
    }
  }

  async findOne(id: string): Promise<Invoice> {
    try {
      const invoice = await this.invoiceModel.findById(id).exec();
      if (!invoice) {
        throw new NotFoundException(`invoice with id ${id} not found`);
      }
      return invoice;
    } catch (error) {
      console.error(error);
    }
  }

  async remove(id: string): Promise<Invoice> {
    try {
      const deletedInvoice = await this.invoiceModel
        .findByIdAndDelete(id)
        .exec();
      if (!deletedInvoice) {
        throw new NotFoundException(`invoice with id ${id} not found`);
      }
      return deletedInvoice;
    } catch (error) {
      console.error(error);
    }
  }

  private async filterProductsArrayAndCoating(invoice: Invoice): Promise<void> {
    console.log('my created invoice', invoice);
    const groupedProducts: any = invoice.products.reduce(
      (acc: any, curr: any) => {
        const key = `${curr.coating}-${curr.color}`;
        if (!acc[key]) {
          acc[key] = [];
        }
        acc[key].push(curr);
        return acc;
      },
      {},
    );
    console.log('my grouped', groupedProducts);
    const myArray: any[] = [];
    for (const [key, value] of Object.entries(groupedProducts)) {
      let coatingDetails = {
        coating: '',
        color: '',
        coatingTotal: 0,
        coatingRate: 0,
        coatingDiscount: 0,
        coatingWeight: 0,
        name: '',
      };
      (value as any[]).map((val: any) => {
        coatingDetails.coating = val.coating;
        coatingDetails.color = val.color;
        coatingDetails.coatingTotal += val.coatingTotal;
        coatingDetails.coatingWeight += val.coatingWeight;
        coatingDetails.coatingDiscount += val.coatingDiscount;
        coatingDetails.coatingRate += val.coatingRate;
        coatingDetails.name = val.coatingName;
      });
      console.log('my coating details', coatingDetails);
      console.log('my val', value);
      (value as any[]).push(coatingDetails);
      myArray.push(value);
    }
    console.log('my array', myArray);
    invoice.invoiceProducts = myArray.flat().flat();
    console.log('invoice data', invoice.invoiceProducts);
  }
}
