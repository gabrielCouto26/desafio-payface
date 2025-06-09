import { NestFactory } from '@nestjs/core';
import { Context, Handler, SQSEvent } from 'aws-lambda';
import { INestApplicationContext } from '@nestjs/common';
import { TransactionModule } from '../app/transaction/transaction.module';
import { SqsLambdaHandler } from '../app/transaction/transaction.handler';

let cachedApp: INestApplicationContext;
export const handler: Handler = async (event: SQSEvent, context: Context) => {
  cachedApp = cachedApp
    ? cachedApp
    : await NestFactory.createApplicationContext(TransactionModule);

  const sqsLambdaHandler = cachedApp.get(SqsLambdaHandler);
  return await sqsLambdaHandler.handler(event, context);
};
