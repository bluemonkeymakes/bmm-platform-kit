import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { HealthController } from './health/health.controller';
import { RobotsController } from './robots.controller';
import { ContentModule } from './content/content.module';
import { CrmModule } from './crm/crm.module';
import { ContactModule } from './contact/contact.module';
import { NotificationsModule } from './notifications/notifications.module';
import { RequestLoggerMiddleware } from './middleware/request-logger.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    // Backstop rate limit on every route.
    //
    // NOTE: in the normal BFF flow the only caller is the web server, so every
    // request arrives from ONE source IP and shares a single bucket — the limit
    // is therefore set well above real SSR traffic. Per-visitor throttling for
    // the public contact form lives in the web app
    // (apps/web/app/lib/rate-limit.server.ts), which is the layer that still
    // knows the visitor's IP. This guard is here to blunt a direct hammering of
    // the API if it is ever exposed, not to replace that.
    ThrottlerModule.forRoot([
      { name: 'default', ttl: 60_000, limit: 300 },
    ]),
    ContentModule,
    CrmModule,
    ContactModule,
    NotificationsModule,
  ],
  controllers: [HealthController, RobotsController],
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggerMiddleware).forRoutes('*');
  }
}
