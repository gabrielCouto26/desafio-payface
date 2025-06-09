import { Module } from '@nestjs/common';
import { TransactionConsumer } from './transaction.consumer';
import { SqsLambdaHandler } from './transaction.handler';
import { redisClientFactory } from '../../database/redis';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction])],
  providers: [TransactionConsumer, SqsLambdaHandler, redisClientFactory],
})
export class TransactionModule {}
