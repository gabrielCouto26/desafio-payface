import { Inject } from '@nestjs/common';
import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';
import { NotificationMessage } from '../../core/notification/notification.interface';
import NotificationCore from '../../core/notification/notification.core';

interface NotificationResult {
  status: 'NOTIFIED' | 'ERROR';
  error?: string;
}

export class NotificationMessenger {
  private snsClient: SNSClient;

  constructor(
    @Inject(NotificationCore) private notificationCore: NotificationCore,
  ) {
    this.snsClient = new SNSClient({
      region: process.env.AWS_REGION || 'us-east-1',
    });
  }

  async send(message: NotificationMessage): Promise<NotificationResult> {
    try {
      switch (message.type) {
        case 'TRANSACTION_SUCCESS':
          await this.handleTransactionSuccess(message);
          break;
        default:
          console.warn('Unknown notification type:', message.type);
      }

      return { status: 'NOTIFIED' };
    } catch (error) {
      console.error('Error processing notification:', error);
      return { status: 'ERROR', error: error.message };
    }
  }

  private async handleTransactionSuccess(message: NotificationMessage) {
    console.log(`Transaction successful at ${message.timestamp}:`, {
      from: message.data.fromWalletId,
      to: message.data.toWalletId,
      amount: message.data.amount,
    });

    const notificationMessage = this.notificationCore.buildMessage(message);

    try {
      const emailCommand = new PublishCommand({
        TopicArn: process.env.EMAIL_TOPIC_ARN,
        Message: notificationMessage,
        Subject: 'Transação bem sucedida',
      });

      await this.snsClient.send(emailCommand);
      console.log('Email notification sent successfully');
    } catch (error) {
      console.error('Error sending notification:', error);
      throw new Error('Failed to send notification');
    }
  }
}
