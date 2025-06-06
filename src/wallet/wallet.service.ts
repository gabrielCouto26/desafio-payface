import { Injectable } from '@nestjs/common';
import { TransactionDto } from './dto/transaction.dto';

@Injectable()
export class WalletService {
  async sendMoney(transactionDto: TransactionDto) {
    const message = {
      fromWalletId: transactionDto.fromWalletId,
      toWalletId: transactionDto.toWalletId,
      amount: transactionDto.amount,
    };

    // TODO: Implement SQS client injection and message sending

    console.log('Transaction message:', message);

    return { status: 'QUEUED' };
  }
}
