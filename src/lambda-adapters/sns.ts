import { NestFactory } from '@nestjs/core';
import { Context, Handler, SNSEvent } from 'aws-lambda';
import { INestApplicationContext } from '@nestjs/common';
import { NotificationModule } from '../app/notification/notification.module';
import { NotificationHandler } from '../app/notification/notification.handler';

let cachedApp: INestApplicationContext;

export const handler: Handler = async (event: SNSEvent, context: Context) => {
  try {
    console.log('Received event:', event);
    console.log('Received context:', context);

    cachedApp = cachedApp
      ? cachedApp
      : await NestFactory.createApplicationContext(NotificationModule);

    const notificationHandler = cachedApp.get(NotificationHandler);
    const result = await notificationHandler.handler(event);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Notifications processed successfully',
        result,
      }),
    };
  } catch (error) {
    console.error('Error in SNS Lambda handler:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Error processing notifications',
        error: error.message,
      }),
    };
  }
};
