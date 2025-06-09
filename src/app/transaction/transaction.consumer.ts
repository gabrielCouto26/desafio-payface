import { Inject, Injectable } from '@nestjs/common';
import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';
import TransactionCore from '@core/transaction/transaction.core';
import { TransactionDto } from '@core/transaction/dto/transaction.dto';

@Injectable()
export class TransactionConsumer {
  private readonly snsClient: SNSClient;
  private readonly topicArn: string;

  constructor(
    @Inject(TransactionCore) private readonly transaction: TransactionCore,
  ) {
    const region = process.env.AWS_REGION || 'us-east-1';
    this.snsClient = new SNSClient({
      region,
    });
    this.topicArn = process.env.SNS_TOPIC_ARN || '';
  }

  async process(message: TransactionDto) {
    try {
      console.log('Processing transaction:', message);

      await this.transaction.execute(message);

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
