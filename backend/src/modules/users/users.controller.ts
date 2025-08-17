import { Public } from '@mguay/nestjs-better-auth';
import { Controller, Get } from '@nestjs/common';

@Controller('users')
export class UsersController {
  @Public()
  @Get('public')
  pulicRuote() {
    return { message: 'Hello this is public route' };
  }
}
