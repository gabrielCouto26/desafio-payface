import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Transaction } from '@core/transaction/entities/transaction.entity';

@Injectable()
export default class TransactionRepository extends Repository<Transaction> {}
