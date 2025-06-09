export enum TransactionStatus {
  PENDING = 'pending',
  SUCCESS = 'success',
  FAILED = 'failed',
}

export interface ProcessedTransaction {
  walletId: string;
  toWalletId: string;
  amount: number;
  status: TransactionStatus;
  createdAt: Date;
}
