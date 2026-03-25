import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { DiscordService } from './discord.service';
import { AdminEmailService } from './admin-email.service';

@Module({
  providers: [NotificationsService, DiscordService, AdminEmailService],
  exports: [NotificationsService],
})
export class NotificationsModule {}
