import { Module } from '@nestjs/common';
import { NotificationHandler } from './notification.handler';
import { NotificationMessenger } from './notification.messenger';
import { NotificationCoreModule } from '../../core/notification/notification.core.module';

@Module({
  imports: [NotificationCoreModule],
  providers: [NotificationHandler, NotificationMessenger],
})
export class NotificationModule {}
