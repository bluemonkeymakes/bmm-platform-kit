import './common/sentry';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WinstonModule } from 'nest-winston';
import { AppModule } from './app.module';
import { createWinstonConfig } from './common/logger/winston.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger(createWinstonConfig()),
  });

  const config = app.get(ConfigService);

  // CORS — restrict to known frontend origins
  const corsOrigin = config.get<string>('CORS_ORIGIN') || 'http://localhost:3001';
  app.enableCors({
    origin: corsOrigin.split(',').map((o) => o.trim()),
    credentials: true,
  });

  // Global validation — strips unknown fields, transforms types
  app.useGlobalFilters();
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
