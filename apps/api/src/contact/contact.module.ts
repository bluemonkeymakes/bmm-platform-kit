import { Module } from '@nestjs/common';
import { ContactController } from './contact.controller';
import { CrmModule } from '../crm/crm.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [CrmModule, NotificationsModule],
  controllers: [ContactController],
})
export class ContactModule {}
