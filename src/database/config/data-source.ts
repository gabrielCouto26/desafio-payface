import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { Transaction } from '../../core/transaction/entities/transaction.entity';
import { Wallet } from '../../core/wallet/entities/wallet.entity';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'payface',
  entities: [Transaction, Wallet],
  synchronize: process.env.ENV == 'PROD' ? false : true,
  migrations: ['src/database/migrations/*.ts'],
  migrationsRun: true,
  ssl: {
    rejectUnauthorized: false,
  },
});
