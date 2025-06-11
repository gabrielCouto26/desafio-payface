import { Module } from '@nestjs/common';
import NotificationCore from './notification.core';

@Module({
  providers: [NotificationCore],
  exports: [NotificationCore],
})
export class NotificationCoreModule {}
