import './common/sentry';
import helmet from 'helmet';
import { NestFactory, HttpAdapterHost } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { WinstonModule } from 'nest-winston';
import { AppModule } from './app.module';
import { createWinstonConfig } from './common/logger/winston.config';
import { SentryExceptionFilter } from './common/filters/sentry-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: WinstonModule.createLogger(createWinstonConfig()),
  });

  const config = app.get(ConfigService);

  // Security headers. This API serves JSON, not documents, so the CSP that
  // matters is the web app's (apps/web/app/entry.server.tsx) — helmet is here
  // for nosniff, frameguard, HSTS and friends.
  app.use(helmet());
  app.getHttpAdapter().getInstance().disable('x-powered-by');

  // Body size cap — the default 100kb is plenty for a contact form and keeps a
  // multi-megabyte POST from tying up the process.
  app.useBodyParser('json', { limit: '100kb' });

  // CORS — restrict to known frontend origins
  const corsOrigin = config.get<string>('CORS_ORIGIN') || 'http://localhost:3001';
  app.enableCors({
    origin: corsOrigin.split(',').map((o) => o.trim()),
    credentials: true,
  });

  // Sentry/GlitchTip — captures 5xx to error tracker
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new SentryExceptionFilter(httpAdapter));

  // Global validation — strips unknown fields, transforms types
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: false,
    }),
  );

  // API prefix
  app.setGlobalPrefix('api', {
    exclude: ['health', 'robots.txt'],
  });

  const port = config.get<number>('API_PORT') || 4001;
  await app.listen(port);
  console.log(`API running on http://localhost:${port}`);
}
bootstrap();
