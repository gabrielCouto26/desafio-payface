import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  OnModuleDestroy,
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
import { Redis } from 'ioredis';

@Injectable()
export default class TransactionCore implements OnModuleDestroy {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    @InjectRepository(Wallet)
    private readonly walletRepository: Repository<Wallet>,
    @Inject('RedisClient')
    private readonly redisClient: Redis,
  ) {}

  onModuleDestroy(): void {
    this.redisClient.disconnect();
  }

  async execute(transactionDto: TransactionDto) {
    console.log('Processing transaction');

    const { fromWalletId, toWalletId, amount } = transactionDto;

    const sourceWallet = await this.getWallet(fromWalletId);

    const error = this.checkWalletBalance(sourceWallet!, amount);

    if (error) {
      await this.createTransaction(transactionDto, TransactionStatus.FAILED);
      console.error(error);
      throw error;
    }

    await this.decreaseWalletBalance(sourceWallet!, amount);
    await this.increaseWalletBalance(toWalletId, amount);

    await this.createTransaction(transactionDto, TransactionStatus.SUCCESS);
  }

  private async getWallet(walletId: string): Promise<Wallet | null> {
    const cachedWallet = await this.getWalletFromCache(walletId);
    console.log('cachedWallet', cachedWallet);

    if (cachedWallet) {
      return cachedWallet;
    }

    const wallet = await this.walletRepository.findOne({
      where: { id: walletId },
    });

    if (!wallet) {
      throw new NotFoundException(`Wallet ${walletId} not found`);
    }

    return wallet;
  }

  private checkWalletBalance(wallet: Wallet, amount: number): Error | null {
    if (wallet.balance < amount) {
      return new BadRequestException(
        `Insufficient balance for wallet ${wallet.id}`,
      );
    }

    return null;
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
    await this.setWalletInCache(wallet);
  }

  private async decreaseWalletBalance(wallet: Wallet, amount: number) {
    wallet.balance = Number(wallet.balance) - amount;
    await this.walletRepository.save(wallet);
    await this.setWalletInCache(wallet);
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

  private async getWalletFromCache(walletId: string): Promise<Wallet | null> {
    const cachedWallet = await this.redisClient.get(walletId);
    if (cachedWallet) {
      return JSON.parse(cachedWallet);
    }
    return null;
  }

  private async setWalletInCache(wallet: Wallet) {
    await this.redisClient.set(wallet.id, JSON.stringify(wallet));
  }
}
