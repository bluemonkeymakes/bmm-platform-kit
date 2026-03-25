import { Controller, Get, Param, Query, NotFoundException } from '@nestjs/common';
import { ContentService } from './content.service';

@Controller('content')
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @Get('pages')
  getPages() {
    return this.contentService.getPages();
  }

  @Get('pages/:slug')
  async getPage(@Param('slug') slug: string) {
    const page = await this.contentService.getPageBySlug(slug);
    if (!page) throw new NotFoundException(`Page "${slug}" not found`);
    return page;
  }

  @Get('articles')
  getArticles(@Query('limit') limit?: string) {
    return this.contentService.getArticles(
      limit ? parseInt(limit, 10) : undefined,
    );
  }

  @Get('articles/:slug')
  async getArticle(@Param('slug') slug: string) {
    const article = await this.contentService.getArticleBySlug(slug);
    if (!article) throw new NotFoundException(`Article "${slug}" not found`);
    return article;
  }
}
