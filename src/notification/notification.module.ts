import { Module } from '@nestjs/common';
import { NotificationHandler } from './notification.handler';
import { NotificationMessenger } from './notification.messenger';

@Module({
  providers: [NotificationHandler, NotificationMessenger],
})
export class NotificationModule {}
