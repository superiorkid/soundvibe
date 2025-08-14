import { Public, Session, type UserSession } from '@mguay/nestjs-better-auth';
import { Controller, Get } from '@nestjs/common';

@Controller('users')
export class UsersController {
  @Get('me')
  getProfile(@Session() session: UserSession) {
    return { user: session.user };
  }

  @Public()
  @Get('public')
  pulicRuote() {
    return { message: 'Hello this is public route' };
  }
}
