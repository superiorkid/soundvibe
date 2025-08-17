import { Public, Session, type UserSession } from '@mguay/nestjs-better-auth';
import { Controller, Get } from '@nestjs/common';

@Controller('users')
export class UsersController {
  @Get('me')
  getProfile(@Session() session: UserSession) {
    const user = session.user;
    return { data: user, success: true, message: 'get session successfully' };
  }

  @Public()
  @Get('public')
  pulicRuote() {
    return { message: 'Hello this is public route' };
  }
}
