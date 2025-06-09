import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import TransactionCore from './transaction.core';
import { Transaction } from './entities/transaction.entity';
import { Wallet } from '../wallet/entities/wallet.entity';
import TransactionRepository from '../../database/repositories/transaction.repository';
import WalletRepository from '../../database/repositories/wallet.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction, Wallet])],
  providers: [TransactionCore, TransactionRepository, WalletRepository],
  exports: [TransactionCore],
})
export class TransactionCoreModule {}
