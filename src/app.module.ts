import { Module } from '@nestjs/common';
import { NotificationModule } from './app/notification/notification.module';
import { TransactionModule } from './app/transaction/transaction.module';
import { WalletModule } from './app/wallet/wallet.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    DatabaseModule,
    NotificationModule,
    TransactionModule,
    WalletModule,
  ],
})
export class AppModule {}
