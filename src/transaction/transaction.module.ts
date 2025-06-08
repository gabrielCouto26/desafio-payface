import { Module } from '@nestjs/common';
import { TransactionConsumer } from './transaction.consumer';
import { SqsLambdaHandler } from './transaction.handler';

@Module({
  providers: [TransactionConsumer, SqsLambdaHandler],
})
export class TransactionModule {}
