import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  private readonly apiKey: string;

  constructor(private configService: ConfigService) {
    this.apiKey = this.configService.get<string>('INTERNAL_API_KEY') || '';
  }

  canActivate(context: ExecutionContext): boolean {
    if (!this.apiKey) {
      throw new UnauthorizedException('API key not configured');
    }
    const request = context.switchToHttp().getRequest();
    const provided = request.headers['x-api-key'];
    if (!provided || provided !== this.apiKey) {
      throw new UnauthorizedException('Invalid API key');
    }
    return true;
  }
}
