import { Handler, Context } from 'aws-lambda';
import { Server } from 'http';
import { createServer, proxy } from 'aws-serverless-express';
import { eventContext } from 'aws-serverless-express/middleware';
import express from 'express';
import { ExpressAdapter } from '@nestjs/platform-express';
import { NestFactory } from '@nestjs/core';
import { WalletModule } from '../app/wallet/wallet.module';
import { INestApplication } from '@nestjs/common';

const binaryMimeTypes: string[] = [];

let cachedServer: Server;
let cachedApp: INestApplication;

process.on('unhandledRejection', (reason) => {
  console.error(reason);
});

process.on('uncaughtException', (reason) => {
  console.error(reason);
});

async function bootstrapServer(): Promise<Server> {
  if (!cachedServer) {
    try {
      const expressApp = express();
      cachedApp = await NestFactory.create(
        WalletModule,
        new ExpressAdapter(expressApp),
      );
      cachedApp.use(eventContext());
      await cachedApp.init();
      cachedServer = createServer(expressApp, undefined, binaryMimeTypes);
    } catch (error) {
      return Promise.reject(error);
    }
  }
  return Promise.resolve(cachedServer);
}

export const handler: Handler = async (event: any, context: Context) => {
  try {
    cachedServer = await bootstrapServer();
    const result = await proxy(cachedServer, event, context, 'PROMISE').promise;

    if (cachedApp) {
      await cachedApp.close();
    }

    return result;
  } catch (error) {
    console.error('Error in Lambda handler:', error);
    throw error;
  }
};
