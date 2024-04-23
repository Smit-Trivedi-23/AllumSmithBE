import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ledgerSchema } from "./entity/ledger.entity";
import { LedgerService } from "./ledger.service";
import { LedgerController } from "./ledger.controller";

@Module({
    imports: [
        MongooseModule.forFeature([{name: 'Ledger', schema: ledgerSchema}])
    ],
    providers: [LedgerService],
    controllers: [LedgerController]
})

export class LedgerModule {}
