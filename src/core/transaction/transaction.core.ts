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
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { Repository } from 'typeorm';

@Injectable()
export default class TransactionCore {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    @InjectRepository(Wallet)
    private readonly walletRepository: Repository<Wallet>,
  ) {}

  async execute(transactionDto: TransactionDto) {
    const { fromWalletId, toWalletId, amount } = transactionDto;

    const [sourceWallet, error] = await this.checkWalletBalance(
      fromWalletId,
      amount,
    );

    if (error) {
      await this.createTransaction(transactionDto, TransactionStatus.FAILED);
      console.error(error);
      throw error;
    }

    await this.decreaseWalletBalance(sourceWallet!, amount);
    await this.increaseWalletBalance(toWalletId, amount);
    await this.createTransaction(transactionDto, TransactionStatus.SUCCESS);
  }

  private async checkWalletBalance(
    walletId: string,
    amount: number,
  ): Promise<[Wallet | null, Error | null]> {
    const wallet = await this.walletRepository.findOne({
      where: { id: walletId },
    });

    if (!wallet) {
      return [null, new NotFoundException(`Wallet ${walletId} not found`)];
    }

    if (wallet.balance < amount) {
      return [
        null,
        new BadRequestException(`Insufficient balance for wallet ${walletId}`),
      ];
    }

    return [wallet, null];
  }

  private async increaseWalletBalance(walletId: string, amount: number) {
    const wallet = await this.walletRepository.findOne({
      where: { id: walletId },
    });

    if (!wallet) {
      throw new NotFoundException(`Wallet ${walletId} not found`);
    }

    wallet.balance = Number(wallet.balance) + amount;
    await this.walletRepository.save(wallet);
  }

  private async decreaseWalletBalance(wallet: Wallet, amount: number) {
    wallet.balance = Number(wallet.balance) - amount;
    await this.walletRepository.save(wallet);
  }

  private async createTransaction(
    transactionDto: TransactionDto,
    status: TransactionStatus,
  ) {
    const transaction = this.buildTransaction(transactionDto, status);
    return this.transactionRepository.save(transaction);
  }

  private buildTransaction(
    transactionDto: TransactionDto,
    status: TransactionStatus,
  ): ProcessedTransaction {
    return {
      fromWalletId: transactionDto.fromWalletId,
      toWalletId: transactionDto.toWalletId,
      amount: transactionDto.amount,
      status,
      createdAt: new Date(),
    };
  }
}
