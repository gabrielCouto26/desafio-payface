import { Injectable } from '@nestjs/common';
import { Context, SQSEvent } from 'aws-lambda';
import { TransactionConsumer } from './transaction.consumer';

@Injectable()
export class TransactionHandler {
  constructor(private readonly transactionConsumer: TransactionConsumer) {}

  async handler(event: SQSEvent, context: Context) {
    console.log('Received event:', JSON.stringify(event, null, 2));
    console.log('Context:', context);

    for (const record of event.Records) {
      try {
        const message = JSON.parse(record.body);
        console.log('Processing message:', message);

        await this.transactionConsumer.process(message);
      } catch (error) {
        console.error('Error processing message:', error);
        throw error;
      }
    }
  }
}
