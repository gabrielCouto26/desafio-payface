import { Module } from '@nestjs/common';
import { TransactionConsumer } from './transaction.consumer';
import { TransactionHandler } from './transaction.handler';
import { TransactionCoreModule } from '../../core/transaction/transaction.core.module';
import { DatabaseModule } from '../../database/database.module';

@Module({
  imports: [TransactionCoreModule, DatabaseModule],
  providers: [TransactionConsumer, TransactionHandler],
})
export class TransactionModule {}
