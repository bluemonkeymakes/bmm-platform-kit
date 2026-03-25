import { Controller, Get, Header } from '@nestjs/common';

@Controller()
export class RobotsController {
  @Get('robots.txt')
  @Header('Content-Type', 'text/plain')
  robots() {
    return 'User-agent: *\nDisallow: /\n';
  }
}
