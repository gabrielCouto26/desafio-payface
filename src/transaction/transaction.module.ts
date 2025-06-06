import { Module } from '@nestjs/common';
import { TransactionConsumer } from './transaction.consumer';

@Module({
  providers: [TransactionConsumer],
})
export class TransactionModule {} 