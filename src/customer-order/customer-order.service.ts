import {
  Injectable,
  NotFoundException,
  NotAcceptableException,
} from '@nestjs/common';
import { CreateCustomerOrderDto } from './dto/create-customer-order.dto';
import { UpdateCustomerOrderDto } from './dto/update-customer-order.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CustomerOrder, ItemSummary } from './entities/customer-order.entity';
import { OnEvent } from '@nestjs/event-emitter';
import { JobDto } from 'src/job/dto/job.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { OrderStatus } from './entities/customer-order.entity';
import { JobHistoryStatus } from './entities/customer-order.entity';
import { Job, JobStatus } from 'src/job/entities/job.entity';
import { Invoice } from 'src/invoice/entity/invoice.entity';
import { generatePDF } from 'src/helper/generatePdf';
import Handlebars from 'handlebars';
import { readFileSync } from 'fs';
import { promises } from 'fs';

@Injectable()
export class CustomerOrderService {
  constructor(
    @InjectModel('CustomerOrder')
    private readonly customerOrderModel: Model<CustomerOrder>,
    @InjectModel('Job') private readonly jobModel: Model<Job>,
    private eventEmitter: EventEmitter2,
  ) {}

  // async create(createCustomerOrderDto: CreateCustomerOrderDto): Promise<CustomerOrder> {
  //   const createdOrder = new this.customerOrderModel(createCustomerOrderDto);
  //   await createdOrder.save();

  //   const customerProducts = createdOrder.entries.filter(product => product.withoutMaterial);
  //   if (customerProducts && customerProducts.length > 0) {
  //     const wmproducts = customerProducts.map(product => {
  //       return {
  //         product: product.product,
  //         quantity: product.quantity,
  //         coating: product.coating,
  //         color: product.color,
  //         status: product.status
  //       }
  //     })
  //     console.log('wmproducts', wmproducts);

  //     await this.customerOrderModel.findByIdAndUpdate(
  //       createdOrder._id,
  //       {
  //         $push: { wmproducts: { $each:  wmproducts  } },
  //         $pull: {entries:  {withoutMaterial: true}}
  //       },
  //       {new: true}
  //     )
  //   }
  //   return createdOrder;
  // }

  async create(
    createCustomerOrderDto: CreateCustomerOrderDto,
  ): Promise<CustomerOrder> {
    const createdOrder = new this.customerOrderModel(createCustomerOrderDto);
    const customerProducts = createdOrder.entries.filter(
      (product) => product.withoutMaterial,
    );

    if (customerProducts.length > 0) {
      const wmproducts: any = customerProducts.map((product) => ({
        product: product.product,
        quantity: product.quantity,
        coating: product.coating,
        color: product.color,
        status: OrderStatus.PENDING,
        mm: product.mm !== undefined ? product.mm : null,
      }));

      createdOrder.wmproducts.push(...wmproducts);
    }
    createdOrder.entries = createdOrder.entries
      .map((entry) => ({
        ...entry,
        status: OrderStatus.PENDING,
      }))
      .filter((entry) => !entry.withoutMaterial);

    await createdOrder.save();
    this.eventEmitter.emit('updateCounter', 'customerOrderCounter');

    return createdOrder;
  }

  async generateReceipt(customerOrder: any): Promise<any> {
    console.log('customer order in generateReceipt', customerOrder);
    Handlebars.registerHelper('inc', function (value) {
      return value + 1;
    });
    Handlebars.registerHelper('calcTotalWeight', function (weight, quantity) {
      const totalWeight = weight * quantity;
      const roundedWeight = totalWeight.toFixed(2);
      return roundedWeight;
    });
    Handlebars.registerHelper('getVersionNumber', function (pdfData) {
      const versionNumber = pdfData ? pdfData.length + 1 : 1;
      return `#${versionNumber}`;
    });
    Handlebars.registerHelper('currentDate', function () {
      const date = new Date();
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    });
    Handlebars.registerHelper('getEstimateWeight', function (entries) {
      const weight = entries
        .reduce((acc: any, curr: any) => {
          const totalWeight = curr.product.weight * curr.quantity;
          return acc + totalWeight;
        }, 0)
        .toFixed(2);
      return weight;
    });

    const source = readFileSync('src/helper/co.hbs', 'utf8').toString();

    const template = Handlebars.compile(source);
    await promises.writeFile('coHTML.html', template(customerOrder));

    const generatedReceipt = await generatePDF('coHTML.html');
    console.log('generatedReceipt', generatedReceipt);

    return generatedReceipt;
  }

  async generateReceiptPdfById(id: string): Promise<any> {
    const customerOrder = await this.customerOrderModel
      .findById(id)
      .populate([
        {
          path: 'entries.product',
          model: 'Product',
        },
        {
          path: 'entries.coating',
          model: 'Coating',
          select: 'name',
        },
        {
          path: 'entries.color',
          model: 'Color',
          select: 'name',
        },
        {
          path: 'customer',
          model: 'Customer',
        },
      ])
      .lean()
      .exec();
    if (customerOrder) {
      const generatedReceipt = await this.generateReceipt(customerOrder);
      console.log('receipt', generatedReceipt);
      return generatedReceipt;
    } else {
      throw new NotFoundException(`customer order with ${id} not found`);
    }
  }

  async findAll(): Promise<CustomerOrder[]> {
    return this.customerOrderModel
      .find()
      .populate([
        {
          path: 'customer',
          model: 'Customer'
        },
        {
          path: 'entries.product',
          model: 'Product',
          options: {
            $exists: true,
          },
        },
        {
          path: 'entries.coating',
          model: 'Coating',
          options: {
            $exists: true,
          },
        },
        {
          path: 'entries.color',
          model: 'Color',
          options: {
            $exists: true,
          },
        },
        {
          path: 'wmproducts.coating',
          model: 'Coating',
          select: 'name',
          options: {
            $exists: true,
          },
        },
        {
          path: 'wmproducts.color',
          model: 'Color',
          options: {
            $exists: true,
          },
        },
      ])
      .exec();
  }

  async findOne(id: string): Promise<CustomerOrder> {
    const customerOrder = await this.customerOrderModel
      .findById(id)
      .populate([
        {
          path: 'customer',
          model: 'Customer'
        },
        {
          path: 'entries.product',
          model: 'Product'
        },
        {
          path: 'entries.coating',
          model: 'Coating'
        },
        {
          path: 'entries.color',
          model: 'Color',
          select: 'name',
        },
        {
          path: 'wmproducts.coating',
          model: 'Coating',
          options: {
            $exists: true,
          },
        },
        {
          path: 'wmproducts.color',
          model: 'Color',
          options: {
            $exists: true,
          },
        },
      ])
      .exec();
    if (!customerOrder) {
      throw new NotFoundException(`customer order with id ${id} not found`);
    }
    return customerOrder;
  }

  async update(
    id: string,
    updateCustomerOrderDto: UpdateCustomerOrderDto,
  ): Promise<CustomerOrder> {
    const updatedCustomerOrder = await this.customerOrderModel
      .findByIdAndUpdate(id, updateCustomerOrderDto, { new: true })
      .exec();
    if (!updateCustomerOrderDto) {
      throw new NotFoundException(`customer order with id ${id} not found`);
    }
    return updatedCustomerOrder;
  }

  async remove(id: string): Promise<CustomerOrder> {
    const deletedCustomerOrder = await this.customerOrderModel
      .findByIdAndDelete(id)
      .exec();
    if (!deletedCustomerOrder) {
      throw new NotFoundException(`customer order with id ${id} not found`);
    }
    return deletedCustomerOrder;
  }

  @OnEvent('job.in_progress')
  async updatePendingQuantity(data: any): Promise<any> {
    let job = await this.jobModel.findById(data.id).exec();
    console.log('co job', job);

    try {
      job.batch.map(async (batch) => {
        let customerOrder = await this.customerOrderModel.findById(
          batch.coEntry,
        );
        console.log('customerOrder', customerOrder);
        batch &&
          batch.products?.length > 0 &&
          batch.products.map(async (item) => {
            let updatedCO = customerOrder.entries.find(
              (product) =>
                product.product.toString() === item.product.toString(),
            );
            console.log('co item to update', updatedCO);

            if (updatedCO.pendingQuantity) {
              if (updatedCO.pendingQuantity === 0) {
                throw new NotAcceptableException('Job is already completed');
              } else {
                updatedCO.pendingQuantity -= item.quantity;
              }
            } else {
              const pendingQuantity = updatedCO.quantity - item.quantity;
              updatedCO.pendingQuantity = pendingQuantity;
            }
            if (!updatedCO.itemSummary) {
              updatedCO.itemSummary = {
                pendingQuantity: updatedCO.pendingQuantity,
                coatingQuantity: 0,
                deliveredQuantity: 0,
              };
            } else {
              updatedCO.itemSummary.pendingQuantity = updatedCO.pendingQuantity;
            }
            console.log('newPendingQuantity', updatedCO.pendingQuantity);

            // updatedCO.status = updatedCO.pendingQuantity === 0 ? OrderStatus.COMPLETED : OrderStatus.PARTIAL
            updatedCO.status = OrderStatus.PARTIAL;
          });
        if (customerOrder.entries) {
          customerOrder.markModified('entries');
        }
        await customerOrder.save();
      });
      if (job.selfProducts) {
        console.log('move to FI');
      }
    } catch (error) {
      console.log(error);
    }
  }

  @OnEvent('job.completed')
  async updateTheCustomerOrder(data: any): Promise<void> {
    try {
      const job = await this.jobModel.findById(data.id).exec();
      console.log('myJob', job);

      if (!job) {
        throw new NotFoundException('Job not found');
      }

      for (const batch of job.batch) {
        const customerOrder = await this.customerOrderModel.findById(
          batch.coEntry,
        );
        console.log('my order', customerOrder);

        if (!customerOrder) {
          throw new NotFoundException('Customer order not found');
        }

        await Promise.all(
          batch.products.map(async ({ product, quantity }) => {
            const itemToUpdate = customerOrder.entries.find(
              (item) => item.product.toString() === product.toString(),
            );
            console.log('my item to update', itemToUpdate);

            if (!itemToUpdate) {
              throw new NotFoundException(
                'Item not found in the customer order',
              );
            }

            if (!itemToUpdate.jobHistory) {
              itemToUpdate.jobHistory = [];
            }

            const jobHistory = {
              coId: batch.coEntry,
              jobId: data.id,
              jobName: job.name,
              quantity: quantity,
              status: JobHistoryStatus.COMPLETED,
            };

            if (!itemToUpdate.itemSummary) {
              itemToUpdate.itemSummary = {
                pendingQuantity: itemToUpdate.pendingQuantity,
                coatingQuantity: quantity,
                deliveredQuantity: 0,
              };
            } else {
              Object.assign(itemToUpdate.itemSummary, {
                // pendingQuantity:
                //   itemToUpdate.itemSummary.pendingQuantity - quantity,
                coatingQuantity:
                  itemToUpdate.itemSummary.coatingQuantity + quantity,
                deliveredQuantity: 0,
              });
            }

            itemToUpdate.jobHistory.push(jobHistory);
            itemToUpdate.status =
              itemToUpdate.pendingQuantity === 0
                ? OrderStatus.COMPLETED
                : OrderStatus.PARTIAL;
          }),
        );

        customerOrder.markModified('entries');
        await customerOrder.save();
      }

      if (job.selfProducts && job.selfProducts.length > 0) {
        const eventData = {
          branch: job.branch,
          products: job.selfProducts,
        };
        this.eventEmitter.emit('addToFinishInventory', eventData);
      }

      const newJob = {
        job: job,
        powderQuantity: data.powderQuantity,
        worker: data.worker,
        powder: data.powder,
      };
      this.eventEmitter.emit('usedUtility', newJob);

      job.powder = data.powder;
      job.worker = data.worker;
      // job.powderQuantity = data.powderQuantity;

      await job.save();
    } catch (error) {
      console.log(error);
    }
  }

  @OnEvent('updateDelieveryQuantity')
  async updateDelieveryQuantity(invoice: Invoice): Promise<void> {
    console.log('invoice', invoice);

    const customerOrder = await this.customerOrderModel
      .findById(invoice.customerOrder_id)
      .exec();
    console.log('customerOrder', customerOrder);

    invoice &&
      invoice?.products.map((product) => {
        const coItemToUpdate = customerOrder.entries.find(
          (item) => item.product.toString() === product.product.toString(),
        );
        console.log('co item', coItemToUpdate);
        if (coItemToUpdate) {
          // coItemToUpdate.pendingQuantity -= product.delieveryQuantity
          console.log('pendingQuantity', coItemToUpdate.pendingQuantity);

          if (!coItemToUpdate.deliveryHistory) {
            coItemToUpdate.deliveryHistory = [];
          }

          const deliveryHistory = {
            coId: customerOrder._id,
            invoiceId: invoice._id,
            quantity: product.delieveryQuantity,
          };
          const { itemSummary: itemSummary } = coItemToUpdate;
          console.log('old itemSummary -->>', itemSummary);
          // itemSummary.pendingQuantity = coItemToUpdate.pendingQuantity
          itemSummary.deliveredQuantity += product.delieveryQuantity;
          itemSummary.coatingQuantity -= product.delieveryQuantity;
          coItemToUpdate.deliveryHistory.push(deliveryHistory);
        } else {
          console.log('product is not present inside the cutomer order');
        }
      });
    console.log('updated customer order', customerOrder);
    console.log('final invoice', invoice);
    customerOrder.markModified('entries');
    await customerOrder.save();
  }

  @OnEvent('jobwm.update')
  async jobWmUpdate(data: any): Promise<any> {
    console.log('in completed data', data);

    try {
      data.job.batch.map(async (batch: any) => {
        const customerOrder = await this.customerOrderModel
          .findById(batch.coEntry)
          .exec();
        for (const product of batch.products) {
          console.log('product in job wm', product);

          const prodToUpdate = customerOrder.wmproducts.find(
            (prod) => prod?.product === product?.product,
          );
          console.log('prod update', prodToUpdate);

          if (prodToUpdate.status === OrderStatus.COMPLETED) {
            console.log('already completed');
            continue;
          }
          prodToUpdate.status = data.status;
          if (data.status === OrderStatus.COMPLETED) {
            const myCompletedata = {
              job: data.job,
              worker: data.data.worker,
              powder: data.data.powder,
              powderQuantity: data.data.powderQuantity,
            };
            this.eventEmitter.emit('usedUtility', myCompletedata);
          }
        }
        customerOrder.markModified('wmproducts');
        await customerOrder.save();
      });
    } catch (error) {
      console.log('error in jobwm update', error);
    }
  }
}
