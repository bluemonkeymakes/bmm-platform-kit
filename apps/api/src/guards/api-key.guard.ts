import { timingSafeEqual } from 'node:crypto';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/**
 * Shared-secret auth for the internal API. The web server sends
 * `X-API-Key: $INTERNAL_API_KEY` on every server-to-server call.
 *
 * Fails CLOSED: an unset or empty INTERNAL_API_KEY rejects every request
 * rather than waving them through.
 */
@Injectable()
export class ApiKeyGuard implements CanActivate {
  private readonly apiKey: Buffer;

  constructor(private configService: ConfigService) {
    this.apiKey = Buffer.from(
      this.configService.get<string>('INTERNAL_API_KEY') || '',
      'utf8',
    );
  }

  canActivate(context: ExecutionContext): boolean {
    if (this.apiKey.length === 0) {
      throw new UnauthorizedException('API key not configured');
    }

    const request = context.switchToHttp().getRequest();
    const header = request.headers['x-api-key'];
    const provided = Buffer.from(
      typeof header === 'string' ? header : '',
      'utf8',
    );

    // Constant-time compare. `!==` on strings short-circuits at the first
    // differing byte, which leaks the key a byte at a time to anyone who can
    // time the response. timingSafeEqual throws on length mismatch, so the
    // length check has to come first.
    if (
      provided.length !== this.apiKey.length ||
      !timingSafeEqual(provided, this.apiKey)
    ) {
      throw new UnauthorizedException('Invalid API key');
    }

    return true;
  }
}
