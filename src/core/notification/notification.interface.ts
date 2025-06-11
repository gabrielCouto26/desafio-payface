export interface NotificationMessage {
  type: string;
  data: NotificationData;
  timestamp: string;
}

interface NotificationData {
  fromWalletId: string;
  toWalletId: string;
  amount: number;
}
