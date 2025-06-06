import { Injectable } from '@nestjs/common';
import {
  SQSClient,
  ReceiveMessageCommand,
  DeleteMessageCommand,
} from '@aws-sdk/client-sqs';

@Injectable()
export class TransactionConsumer {
  private readonly sqsClient: SQSClient;
  private readonly queueUrl: string;

  constructor() {
    this.sqsClient = new SQSClient({
      region: process.env.AWS_REGION || 'us-east-1',
    });
    this.queueUrl = process.env.SQS_QUEUE_URL || '';
  }

  async process() {
    try {
      const command = new ReceiveMessageCommand({
        QueueUrl: this.queueUrl,
        MaxNumberOfMessages: 1,
      });

      const response = await this.sqsClient.send(command);

      if (response.Messages && response.Messages.length > 0) {
        const message = response.Messages[0];
        const transaction = JSON.parse(message.Body);
        console.log('Processing transaction:', transaction);

        // TODO: Implement transaction processing logic

        // Delete the message after processing
        await this.sqsClient.send(
          new DeleteMessageCommand({
            QueueUrl: this.queueUrl,
            ReceiptHandle: message.ReceiptHandle,
          }),
        );

        return { status: 'PROCESSED' };
      }
    } catch (error) {
      console.error('Error processing message:', error);
      throw error;
    }
  }
}
