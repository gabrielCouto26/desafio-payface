import { Injectable } from '@nestjs/common';

@Injectable()
export class NotificationHandler {
  async handle(message: any) {
    console.log('Processing notification:', message);
    
    // TODO: Implement notification logic
    
    return { status: 'NOTIFIED' };
  }
} 