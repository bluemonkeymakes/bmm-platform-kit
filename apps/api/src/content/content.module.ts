import { Module } from '@nestjs/common';
import { DirectusService } from './directus.service';
import { ContentService } from './content.service';
import { ContentController } from './content.controller';

@Module({
  providers: [DirectusService, ContentService],
  controllers: [ContentController],
  exports: [DirectusService, ContentService],
})
export class ContentModule {}
