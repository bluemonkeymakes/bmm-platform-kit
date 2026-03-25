import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';
import type { AdminAlert } from './notifications.service';

@Injectable()
export class AdminEmailService {
  private readonly logger = new Logger(AdminEmailService.name);
  private readonly resend: Resend | null;
  private readonly fromEmail: string;
  private readonly adminEmail: string;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('RESEND_API_KEY');
    this.resend = apiKey ? new Resend(apiKey) : null;
    this.fromEmail =
      this.configService.get<string>('RESEND_FROM_EMAIL') || 'hello@example.com';
    this.adminEmail =
      this.configService.get<string>('ADMIN_NOTIFICATION_EMAIL') || '';
  }

  async send(alert: AdminAlert): Promise<boolean> {
    if (!this.resend || !this.adminEmail) {
      this.logger.debug('Skipping admin email — RESEND_API_KEY or ADMIN_NOTIFICATION_EMAIL not set');
      return false;
    }

    const fieldRows = (alert.fields || [])
      .map(
        (f) =>
          `<tr><td style="padding:4px 12px 4px 0;font-weight:600">${f.name}</td><td style="padding:4px 0">${f.value}</td></tr>`,
      )
      .join('');

    const fieldsHtml = fieldRows
      ? `<table style="margin:16px 0;border-collapse:collapse">${fieldRows}</table>`
      : '';

    const html = `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto">
        <h2 style="color:#1a1a1a">${alert.title}</h2>
        <p style="color:#444;font-size:16px;line-height:1.6">${alert.message.replace(/\n/g, '<br>')}</p>
        ${fieldsHtml}
        <hr style="border:none;border-top:1px solid #eee;margin:24px 0">
        <p style="color:#999;font-size:12px">Starter Kit API Notification</p>
      </div>
    `;

    try {
      await this.resend.emails.send({
        from: this.fromEmail,
        to: [this.adminEmail],
        subject: alert.title,
        html,
      });
      return true;
    } catch (error) {
      this.logger.error(`Admin email failed: ${error}`);
      return false;
    }
  }
}
