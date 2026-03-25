import { Injectable } from '@nestjs/common';
import { DirectusService } from './directus.service';

export interface Page {
  id: string;
  slug: string;
  title: string;
  status: string;
  blocks?: unknown[];
  [key: string]: unknown;
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  status: string;
  excerpt?: string;
  content?: string;
  date_published?: string;
  featured_image?: string;
  category?: string;
  tags?: string[];
  [key: string]: unknown;
}

@Injectable()
export class ContentService {
  constructor(private readonly directus: DirectusService) {}

  async getPages(): Promise<Page[]> {
    return this.directus.getItems<Page>('pages', {
      filter: { status: { _eq: 'published' } },
      sort: ['sort', 'title'],
    });
  }

  async getPageBySlug(slug: string): Promise<Page | null> {
    return this.directus.getItemByField<Page>('pages', 'slug', slug);
  }

  async getArticles(limit?: number): Promise<Article[]> {
    return this.directus.getItems<Article>('articles', {
      filter: { status: { _eq: 'published' } },
      sort: ['-date_published'],
      limit: limit || -1,
    });
  }

  async getArticleBySlug(slug: string): Promise<Article | null> {
    return this.directus.getItemByField<Article>('articles', 'slug', slug);
  }
}
