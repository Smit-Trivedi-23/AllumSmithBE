import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CustomerDto } from './dto/create-customer.dto';
import { Customer } from './entities/customer.entity';
import { OnEvent } from '@nestjs/event-emitter';
import { Ledger } from 'src/ledger/entity/ledger.entity';
import { CreateLedgerDto } from 'src/ledger/dto/create-ledger.dto';

@Injectable()
export class CustomerService {
  constructor(
    @InjectModel(Customer.name) private readonly customerModel: Model<Customer>,
  ) {}

  async create(customerDto: CustomerDto): Promise<Customer> {
    const createdCustomer = new this.customerModel(customerDto);
    return createdCustomer.save();
  }

  async findAll(): Promise<Customer[]> {
    return this.customerModel
      .find()
      .populate([
        {
          path: 'associatedInvoices',
          model: 'Invoice',
        },
      ])
      .exec();
  }

  async findOne(id: string): Promise<Customer> {
    return this.customerModel
      .findById(id)
      .populate([
        {
          path: 'associatedInvoices',
          model: 'Invoice',
        },
      ])
      .exec();
  }

  async update(id: string, customerDto: CustomerDto): Promise<Customer> {
    return this.customerModel
      .findByIdAndUpdate(id, customerDto, { new: true })
      .exec();
  }

  async remove(id: string): Promise<void> {
    await this.customerModel.findByIdAndDelete(id).exec();
  }

  async getAllInvoiceOfCustomer(id: string): Promise<any> {
    try {
      const invoices = this.customerModel
        .findById(id)
        .populate([
          {
            path: 'associatedInvoices',
            model: 'Invoice',
          },
        ])
        .exec();
      if (invoices) {
        return invoices;
      } else {
        return [];
      }
    } catch (error) {
      console.log(error);
    }
  }

  @OnEvent('associateInvoiceWithCustomer')
  async associateInvoiceWithCustomer(invoice: any): Promise<any> {
    console.log('my invoice', invoice);
    const myCustomer: Customer = await this.customerModel
      .findById(invoice.customerName)
      .exec();

    myCustomer.associatedInvoices.push(invoice._id);
    myCustomer.markModified('associatedInvoices');
    if (!myCustomer.pending_amount) {
      myCustomer.pending_amount = invoice.totalAmount;
    } else {
      myCustomer.pending_amount += invoice.totalAmount;
    }
    await myCustomer.save();
    console.log('my customer', myCustomer);
  }

  @OnEvent('updateCustomerOnLedger')
  async updateCustomerOnLedger(ledger: Ledger): Promise<void> {
    console.log('in update customer ledger');

    console.log('customer ledger', ledger);
    const customer: Customer = await this.customerModel
      .findById(ledger.customer)
      .exec();

    if (customer.pending_amount === ledger.amount_payable) {
      const data = { ledger, customer };
      await this.grandTotalEqualsPayable(data);
    } else if (customer.pending_amount > ledger.amount_payable) {
      const data = { ledger, customer };
      await this.grandTotalGreaterThanPayable(data);
    } else if (customer.pending_amount < ledger.amount_payable) {
      const data = { ledger, customer };
      await this.grandTotalLessThanPayable(data);
    }
  }

  private async grandTotalEqualsPayable(data: any): Promise<void> {
    console.log('in equals');

    const customer: Customer = data.customer;
    const ledger: Ledger = data.ledger;
    if (!customer.paid_amount) {
      customer.paid_amount = ledger.amount_payable;
    } else {
      customer.paid_amount += ledger.amount_payable;
    }

    customer.pending_amount -= ledger.amount_payable;

    await customer.save();
  }

  private async grandTotalGreaterThanPayable(data: any): Promise<void> {
    console.log('in gt greater than Ap');

    const customer: Customer = data.customer;
    const ledger: Ledger = data.ledger;

    if (!customer.paid_amount) {
      customer.paid_amount = ledger.amount_payable;
    } else {
      customer.paid_amount += ledger.amount_payable;
    }

    customer.pending_amount -= ledger.amount_payable;
    await customer.save();
  }

  private async grandTotalLessThanPayable(data: any): Promise<void> {
    console.log('in gt less then ap');

    const customer: Customer = data.customer;
    const ledger: Ledger = data.ledger;

    const creditAmount = Math.abs(
      ledger.amount_payable - customer.pending_amount,
    );
    console.log('credit-amount', creditAmount);

    if (!customer.paid_amount) {
      customer.paid_amount = customer.pending_amount;
    } else {
      customer.paid_amount += customer.pending_amount;
    }

    customer.pending_amount = 0;

    if (!customer.credit_amount) {
      customer.credit_amount = creditAmount;
    } else {
      customer.credit_amount += creditAmount;
    }
    await customer.save();
  }

  @OnEvent('associateCustomerWithLedger')
  async associateCustomerWithLedger(ledgerDto: any): Promise<any> {
    console.log('in associate customer with ledger', ledgerDto);

    try {
      const customer = await this.customerModel
        .findByIdAndUpdate(
          ledgerDto.customer,
          { $push: { associatedLedgers: ledgerDto } },
          { new: true },
        )
        .exec();
      console.log('updated customer', customer);

      return customer; // Return the updated customer object
    } catch (error) {
      console.error('Error associating customer with ledger:', error);
      return null; // Return null to indicate failure
    }
  }
}
