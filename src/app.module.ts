import { Module } from '@nestjs/common';
import { NotificationModule } from './app/notification/notification.module';
import { TransactionModule } from './app/transaction/transaction.module';
import { WalletModule } from './app/wallet/wallet.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppDataSource } from './database';

@Module({
  imports: [
    TypeOrmModule.forRoot(AppDataSource.options),
    NotificationModule,
    TransactionModule,
    WalletModule,
  ],
})
export class AppModule {}
