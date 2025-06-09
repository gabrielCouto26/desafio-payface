import { Injectable } from '@nestjs/common';
import { Repository, Transaction } from 'typeorm';

@Injectable()
export default class TransactionCore {
  constructor(
    private readonly transactionRepository: Repository<Transaction>,
  ) {}
}
