import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { AdminAlert } from './notifications.service';

@Injectable()
export class DiscordService {
  private readonly logger = new Logger(DiscordService.name);
  private readonly webhookUrl: string | undefined;

  constructor(private configService: ConfigService) {
    this.webhookUrl = this.configService.get<string>('DISCORD_WEBHOOK_URL');
  }

  async send(alert: AdminAlert): Promise<boolean> {
    if (!this.webhookUrl) {
      this.logger.debug('Skipping Discord — DISCORD_WEBHOOK_URL not set');
      return false;
    }

    const color =
      alert.priority === 'urgent'
        ? 0xef4444
        : alert.priority === 'high'
          ? 0xf59e0b
          : 0x3b82f6;

    const fields = (alert.fields || []).map((f) => ({
      name: f.name,
      value: f.value.length > 1000 ? f.value.slice(0, 997) + '...' : f.value,
      inline: f.inline ?? false,
    }));

    try {
      const response = await fetch(this.webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          embeds: [
            {
              title: alert.title,
              description:
                alert.message.length > 2000
                  ? alert.message.slice(0, 1997) + '...'
                  : alert.message,
              color,
              fields,
              timestamp: new Date().toISOString(),
            },
          ],
        }),
      });

      if (!response.ok) {
        const text = await response.text();
        this.logger.error(`Discord webhook failed: ${response.status} ${text}`);
        return false;
      }
      return true;
    } catch (error) {
      this.logger.error(`Discord send failed: ${error}`);
      return false;
    }
  }
}
