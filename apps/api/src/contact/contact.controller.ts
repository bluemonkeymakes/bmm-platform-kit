import { Controller, Post, Body, Logger, UseGuards } from '@nestjs/common';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { CrmService } from '../crm/crm.service';
import { NotificationsService } from '../notifications/notifications.service';
import { ApiKeyGuard } from '../guards/api-key.guard';

export class ContactDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsOptional()
  company?: string;

  @IsString()
  @IsNotEmpty()
  message: string;
}

@Controller('contact')
@UseGuards(ApiKeyGuard)
export class ContactController {
  private readonly logger = new Logger(ContactController.name);

  constructor(
    private readonly crm: CrmService,
    private readonly notifications: NotificationsService,
  ) {}

  @Post()
  async submit(@Body() dto: ContactDto) {
    this.logger.log(`Contact form: ${dto.firstName} ${dto.lastName} <${dto.email}>`);

    // Create CRM lead (non-blocking)
    this.crm
      .createLead({
        firstName: dto.firstName,
        lastName: dto.lastName,
        email: dto.email,
        company: dto.company,
        source: 'contact_form',
      })
      .catch((err) => this.logger.error(`CRM lead creation failed: ${err}`));

    // Send admin notification (non-blocking)
    this.notifications
      .notifyAdmin({
        title: 'New Contact Form Submission',
        message: `${dto.firstName} ${dto.lastName} (${dto.email})\n\n${dto.message}`,
        fields: [
          { name: 'Name', value: `${dto.firstName} ${dto.lastName}`, inline: true },
          { name: 'Email', value: dto.email, inline: true },
          ...(dto.company ? [{ name: 'Company', value: dto.company, inline: true }] : []),
        ],
      })
      .catch((err) => this.logger.error(`Notification failed: ${err}`));

    return { success: true };
  }
}
