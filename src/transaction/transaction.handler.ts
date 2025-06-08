import { Injectable } from '@nestjs/common';
import { Context, SQSEvent } from 'aws-lambda';
import { TransactionConsumer } from './transaction.consumer';

@Injectable()
export class SqsLambdaHandler {
  constructor(private readonly transactionConsumer: TransactionConsumer) {}

  async handler(event: SQSEvent, context: Context) {
    try {
      console.log('Processing SQS event:', event);
      console.log('Context:', context);

      const results = await Promise.all(
        event.Records.map(async (record) => {
          try {
            const result = await this.transactionConsumer.process();
            return {
              messageId: record.messageId,
              status: 'success',
              result,
            };
          } catch (error) {
            console.error(
              `Error processing message ${record.messageId}:`,
              error,
            );
            return {
              messageId: record.messageId,
              status: 'error',
              error: error.message,
            };
          }
        }),
      );

      return {
        statusCode: 200,
        body: JSON.stringify({
          message: 'Messages processed successfully',
          results,
        }),
      };
    } catch (error) {
      console.error('Error in SQS Lambda handler:', error);
      return {
        statusCode: 500,
        body: JSON.stringify({
          message: 'Error processing messages',
          error: error.message,
        }),
      };
    }
  }
}
