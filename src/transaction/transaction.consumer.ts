import { Injectable } from '@nestjs/common';
import { SqsMessageHandler } from '@nestjs-packages/sqs';

@Injectable()
export class TransactionConsumer {
  @SqsMessageHandler('transaction-queue', false)
  async process(message: AWS.SQS.Message) {
    const transaction = JSON.parse(message.Body);
    console.log('Processing transaction:', transaction);
    
    // TODO: Implement transaction processing logic
    
    return { status: 'PROCESSED' };
  }
} 