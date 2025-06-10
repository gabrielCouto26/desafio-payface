import { Module } from '@nestjs/common';
import TransactionCore from './transaction.core';
import { DatabaseModule } from '../../database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { Wallet } from '../wallet/entities/wallet.entity';
import { redisClientFactory } from '../../database/config/redis';

@Module({
  imports: [DatabaseModule, TypeOrmModule.forFeature([Transaction, Wallet])],
  providers: [TransactionCore, redisClientFactory],
  exports: [TransactionCore],
})
export class TransactionCoreModule {}
