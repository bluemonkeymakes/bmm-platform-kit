import { Controller, Post, Get, Body, Query, UseGuards } from '@nestjs/common';
import { CrmService, CreateLeadDto } from './crm.service';
import { ApiKeyGuard } from '../guards/api-key.guard';

@Controller('crm')
@UseGuards(ApiKeyGuard)
export class CrmController {
  constructor(private readonly crmService: CrmService) {}

  @Post('leads')
  createLead(@Body() dto: CreateLeadDto) {
    return this.crmService.createLead(dto);
  }

  @Get('leads')
  getLeads(
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    return this.crmService.getLeads(
      limit ? parseInt(limit, 10) : undefined,
      offset ? parseInt(offset, 10) : undefined,
    );
  }
}
