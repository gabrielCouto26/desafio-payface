import { NotificationMessage } from './notification.interface';

export default class NotificationCore {
  constructor() {}

  buildMessage(message: NotificationMessage): string {
    return `
      Transação bem sucedida!
      
      De: ${message.data.fromWalletId}
      Para: ${message.data.toWalletId}
      Valor: ${message.data.amount}
      Data: ${message.timestamp}
    `;
  }
}
