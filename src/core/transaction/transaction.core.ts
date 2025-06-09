import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Wallet } from '../wallet/entities/wallet.entity';
import { TransactionDto } from './dto/transaction.dto';
import {
  ProcessedTransaction,
  TransactionStatus,
} from './transaction.interfaces';
import TransactionRepository from '../../database/repositories/transaction.repository';
import WalletRepository from '../../database/repositories/wallet.repository';

@Injectable()
export default class TransactionCore {
  constructor(
    private readonly transactionRepository: TransactionRepository,
    private readonly walletRepository: WalletRepository,
  ) {}

  async execute(transactionDto: TransactionDto) {
    const [, error] = await this.checkWalletBalance(
      transactionDto.fromWalletId,
      transactionDto.amount,
    );

    if (error) {
      const failed = this.buildTransaction(
        transactionDto,
        TransactionStatus.FAILED,
      );
      await this.createTransaction(failed);
      console.error(error);
      throw error;
    }

    const success = this.buildTransaction(
      transactionDto,
      TransactionStatus.SUCCESS,
    );
    await this.createTransaction(success);
  }

  private async checkWalletBalance(
    walletId: string,
    amount: number,
  ): Promise<[Wallet | null, Error | null]> {
    const wallet = await this.walletRepository.findOne({
      where: { id: walletId },
    });

    if (!wallet) {
      return [null, new NotFoundException('Wallet not found')];
    }

    if (wallet.balance < amount) {
      return [null, new BadRequestException('Insufficient balance')];
    }

    return [wallet, null];
  }

  private async createTransaction(transaction: ProcessedTransaction) {
    return this.transactionRepository.save(transaction);
  }

  private buildTransaction(
    transactionDto: TransactionDto,
    status: TransactionStatus,
  ): ProcessedTransaction {
    return {
      walletId: transactionDto.fromWalletId,
      toWalletId: transactionDto.toWalletId,
      amount: transactionDto.amount,
      status,
      createdAt: new Date(),
    };
  }
}
