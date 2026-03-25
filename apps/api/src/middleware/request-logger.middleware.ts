import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction) {
    const start = Date.now();
    const { method, originalUrl, ip } = req;
    const userAgent = req.get('user-agent') || '-';

    res.on('finish', () => {
      const duration = Date.now() - start;
      this.logger.log(
        `${method} ${originalUrl} ${res.statusCode} ${duration}ms — ${ip} "${userAgent}"`,
      );
    });

    next();
  }
}
