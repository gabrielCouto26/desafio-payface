import { Injectable } from '@nestjs/common';
import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';

interface TransactionMessage {
  fromWalletId: number;
  toWalletId: number;
  amount: number;
}

@Injectable()
export class TransactionConsumer {
  private readonly snsClient: SNSClient;
  private readonly topicArn: string;

  constructor() {
    const region = process.env.AWS_REGION || 'us-east-1';
    this.snsClient = new SNSClient({
      region,
    });
    this.topicArn = process.env.SNS_TOPIC_ARN || '';
  }

  async process(message: TransactionMessage) {
    try {
      console.log('Processing transaction:', message);

      // TODO: Implement transaction processing logic

      await this.snsClient.send(
        new PublishCommand({
          TopicArn: this.topicArn,
          Message: JSON.stringify({
            type: 'TRANSACTION_SUCCESS',
            data: message,
            timestamp: new Date().toISOString(),
          }),
        }),
      );

      console.log('Published success notification to SNS');

      return { status: 'PROCESSED' };
    } catch (error) {
      console.error('Error processing message:', error);
      throw error;
    }
  }
}
