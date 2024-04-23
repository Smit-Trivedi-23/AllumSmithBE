import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { InvoiceSchema } from "./entity/invoice.entity";
import { InvoiceServices } from "./invoice.service";
import { InvoiceController } from "./invoice.controller";
import { CoatingSchema } from "src/coating/entities/coating.entity";
@Module({
    imports: [
        MongooseModule.forFeature([{ name: 'Invoice', schema: InvoiceSchema }]),
        MongooseModule.forFeature([{ name: 'Coating', schema: CoatingSchema }])
    ],
    controllers: [InvoiceController],
    providers: [InvoiceServices]
})

export class InvoiceModule { }