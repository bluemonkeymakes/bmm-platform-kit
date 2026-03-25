import { Injectable, Logger } from '@nestjs/common';
import { DiscordService } from './discord.service';
import { AdminEmailService } from './admin-email.service';

export interface AdminAlert {
  title: string;
  message: string;
  priority?: 'default' | 'high' | 'urgent';
  fields?: Array<{ name: string; value: string; inline?: boolean }>;
}

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    private readonly discord: DiscordService,
    private readonly adminEmail: AdminEmailService,
  ) {}

  async notifyAdmin(alert: AdminAlert): Promise<void> {
    const results = await Promise.allSettled([
      this.discord.send(alert),
      this.adminEmail.send(alert),
    ]);

    const channels = ['Discord', 'Email'];
    results.forEach((result, i) => {
      if (result.status === 'rejected') {
        this.logger.error(`${channels[i]} notification failed: ${result.reason}`);
      }
    });
  }
}
