import { Module } from '@nestjs/common';
import { TransactionConsumer } from './transaction.consumer';
import { TransactionHandler } from './transaction.handler';
import { redisClientFactory } from '../../database/config/redis';
import { TransactionCoreModule } from '../../core/transaction/transaction.core.module';
@Module({
  imports: [TransactionCoreModule],
  providers: [TransactionConsumer, TransactionHandler, redisClientFactory],
})
export class TransactionModule {}
