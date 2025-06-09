import { Module } from '@nestjs/common';
import { TransactionConsumer } from './transaction.consumer';
import { TransactionHandler } from './transaction.handler';
import { redisClientFactory } from '../../database/redis';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction])],
  providers: [TransactionConsumer, TransactionHandler, redisClientFactory],
})
export class TransactionModule {}
