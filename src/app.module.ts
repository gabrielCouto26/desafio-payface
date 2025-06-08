import { Module } from '@nestjs/common';
import { NotificationModule } from './notification/notification.module';
import { TransactionModule } from './transaction/transaction.module';
import { WalletModule } from './wallet/wallet.module';
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
