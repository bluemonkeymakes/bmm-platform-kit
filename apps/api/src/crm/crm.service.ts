import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface CreateLeadDto {
  firstName: string;
  lastName: string;
  email: string;
  company?: string;
  phone?: string;
  source?: string;
}

@Injectable()
export class CrmService {
  private readonly logger = new Logger(CrmService.name);
  private readonly apiUrl: string;
  private readonly apiKey: string;

  constructor(private configService: ConfigService) {
    this.apiUrl =
      this.configService.get<string>('TWENTY_API_URL') || 'http://localhost:3003';
    this.apiKey = this.configService.get<string>('TWENTY_API_KEY') || '';
  }

  private get isConfigured(): boolean {
    return !!this.apiKey;
  }

  private async request<T>(
    method: string,
    path: string,
    body?: unknown,
  ): Promise<T | null> {
    if (!this.isConfigured) {
      this.logger.debug('CRM not configured — skipping');
      return null;
    }

    try {
      const response = await fetch(`${this.apiUrl}/api${path}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: body ? JSON.stringify(body) : undefined,
      });

      if (!response.ok) {
        const text = await response.text();
        this.logger.error(`CRM ${method} ${path} failed: ${response.status} ${text}`);
        return null;
      }

      const json = await response.json();
      return json?.data ?? json;
    } catch (error) {
      this.logger.error(`CRM request failed: ${error}`);
      return null;
    }
  }

  async createLead(dto: CreateLeadDto) {
    return this.request('POST', '/people', {
      name: { firstName: dto.firstName, lastName: dto.lastName },
      emails: { primaryEmail: dto.email },
      phones: dto.phone ? { primaryPhone: dto.phone } : undefined,
      company: dto.company ? { name: dto.company } : undefined,
    });
  }

  async getLeads(limit = 20, offset = 0) {
    return this.request(
      'GET',
      `/people?limit=${limit}&offset=${offset}`,
    );
  }

  async findPersonByEmail(email: string) {
    return this.request(
      'GET',
      `/people?filter=emails.primaryEmail[eq]:${email}`,
    );
  }
}
