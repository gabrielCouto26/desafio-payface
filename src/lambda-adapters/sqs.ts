import { NestFactory } from '@nestjs/core';
import { Context, Handler, SQSEvent } from 'aws-lambda';
import { INestApplicationContext } from '@nestjs/common';
import { TransactionHandler } from '../app/transaction/transaction.handler';
import { TransactionModule } from '../app/transaction/transaction.module';

let cachedApp: INestApplicationContext;
export const handler: Handler = async (event: SQSEvent, context: Context) => {
  if (!cachedApp) {
    cachedApp = await NestFactory.createApplicationContext(TransactionModule);
  }

  const transactionHandler = cachedApp.get(TransactionHandler);
  return await transactionHandler.handler(event, context);
};
