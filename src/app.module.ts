import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationModule } from './app/notification/notification.module';
import { TransactionModule } from './app/transaction/transaction.module';
import { WalletModule } from './app/wallet/wallet.module';
import { AppDataSource } from './database/config';
import { TransactionCoreModule } from './core/transaction/transaction.core.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(AppDataSource.options),
    NotificationModule,
    TransactionModule,
    WalletModule,
    TransactionCoreModule,
  ],
})
export class AppModule {}
