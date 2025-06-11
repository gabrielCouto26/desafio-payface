import { TransactionDto } from '../../core/transaction/dto/transaction.dto';

export default class TransactionValidator {
  static validate(transaction: TransactionDto) {
    if (transaction.amount <= 0)
      throw new Error('Amount must be greater than 0');
    if (transaction.fromWalletId === transaction.toWalletId)
      throw new Error('From and to wallet cannot be the same');
    if (!transaction.fromWalletId || !transaction.toWalletId)
      throw new Error('From and to wallet cannot be empty');
  }
}
