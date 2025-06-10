import { Module } from '@nestjs/common';
import { NotificationModule } from './app/notification/notification.module';
import { TransactionModule } from './app/transaction/transaction.module';
import { WalletModule } from './app/wallet/wallet.module';

@Module({
  imports: [NotificationModule, TransactionModule, WalletModule],
})
export class AppModule {}
