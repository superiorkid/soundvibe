import { Public, Session, type UserSession } from '@mguay/nestjs-better-auth';
import { Controller, Get, Req } from '@nestjs/common';
import { type Request } from 'express';

@Controller('users')
export class UsersController {
  @Get('me')
  getProfile(@Session() session: UserSession, @Req() request: Request) {
    console.log('cookies', request.cookies);
    return { user: session.user };
  }

  @Public()
  @Get('public')
  pulicRuote() {
    return { message: 'Hello this is public route' };
  }
}
