interface NotificationMessage {
  type: string;
  data: NotificationData;
  timestamp: string;
}

interface NotificationData {
  fromWalletId: string;
  toWalletId: string;
  amount: number;
}

interface NotificationResult {
  status: 'NOTIFIED' | 'ERROR';
  error?: string;
}

export class NotificationMessenger {
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

    // TODO: Implement notification delivery logic (email, SMS, etc.)
  }
}
