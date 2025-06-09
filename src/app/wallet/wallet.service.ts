import { Injectable } from '@nestjs/common';
import { TransactionDto } from './dto/transaction.dto';
import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs';

@Injectable()
export class WalletService {
  private readonly sqsClient: SQSClient;
  private readonly queueUrl: string;

  constructor() {
    this.sqsClient = new SQSClient({
      region: process.env.AWS_REGION || 'us-east-1',
    });
    this.queueUrl = process.env.SQS_QUEUE_URL || '';
  }

  async sendMoney(transactionDto: TransactionDto) {
    const message = {
      fromWalletId: transactionDto.fromWalletId,
      toWalletId: transactionDto.toWalletId,
      amount: transactionDto.amount,
    };

    try {
      const command = new SendMessageCommand({
        QueueUrl: this.queueUrl,
        MessageBody: JSON.stringify(message),
      });

      await this.sqsClient.send(command);
      console.log('Transaction message sent to SQS:', message);

      return { status: 'QUEUED' };
    } catch (error) {
      console.error('Error sending message to SQS:', error);
      throw new Error('Failed to queue transaction');
    }
  }
}
