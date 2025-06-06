import { Module } from '@nestjs/common';
import { NotificationHandler } from './notification.handler';

@Module({
  providers: [NotificationHandler],
})
export class NotificationModule {} 