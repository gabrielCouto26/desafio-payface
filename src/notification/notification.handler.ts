import { Injectable } from '@nestjs/common';
import { SNSEvent } from 'aws-lambda';
import { NotificationMessenger } from './notification.messenger';

@Injectable()
export class NotificationHandler {
  constructor(private readonly message: NotificationMessenger) {}

  async handler(event: SNSEvent) {
    for (const record of event.Records) {
      try {
        const message = JSON.parse(record.Sns.Message);
        console.log('Processing message:', message);

        const result = await this.message.send(message);
        return {
          messageId: record.Sns.MessageId,
          status: 'success',
          result,
        };
      } catch (error) {
        console.error(
          `Error processing notification ${record.Sns.MessageId}:`,
          error,
        );
        return {
          messageId: record.Sns.MessageId,
          status: 'error',
          error: error.message,
        };
      }
    }
  }
}
