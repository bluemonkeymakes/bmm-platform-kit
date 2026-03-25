import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createDirectus, rest, readItems, staticToken } from '@directus/sdk';

@Injectable()
export class DirectusService {
  private readonly logger = new Logger(DirectusService.name);
  private readonly client;

  constructor(private configService: ConfigService) {
    const url =
      this.configService.get<string>('DIRECTUS_URL') || 'http://localhost:8055';
    const token = this.configService.get<string>('DIRECTUS_TOKEN') || '';

    this.client = createDirectus(url)
      .with(staticToken(token))
      .with(rest());
  }

  async getItems<T extends object>(
    collection: string,
    query?: Record<string, unknown>,
  ): Promise<T[]> {
    try {
      const result = await this.client.request(
        readItems(collection, query as any),
      );
      return result as T[];
    } catch (error) {
      this.logger.error(`Failed to fetch ${collection}: ${error}`);
      throw error;
    }
  }

  async getItemByField<T extends object>(
    collection: string,
    field: string,
    value: string,
  ): Promise<T | null> {
    try {
      const results = await this.client.request(
        readItems(collection, {
          filter: { [field]: { _eq: value } },
          limit: 1,
        } as any),
      );
      const items = results as T[];
      return items[0] || null;
    } catch (error) {
      this.logger.error(
        `Failed to fetch ${collection} by ${field}: ${error}`,
      );
      throw error;
    }
  }
}
