import {
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { Session, type UserSession } from '@mguay/nestjs-better-auth';
import { UsersRepository } from './users.repository';

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private userRepository: UsersRepository,
  ) {}

  @Get('username/:username')
  async getUserByUsername(@Param('username') username: string) {
    return this.usersService.findOneByUsername(username);
  }

  // get current user comments
  @Get('/comments')
  async getRecentComments(
    @Query('take', new ParseIntPipe({ errorHttpStatusCode: 400 }))
    take: number,
    @Query('username') username: string,
    @Session() session: UserSession,
  ) {
    const user = username
      ? await this.userRepository.findOne({
          where: { displayUsername: username },
        })
      : session.user;

    if (!user) throw new NotFoundException('user not found');

    return this.usersService.getRecentComments({
      limit: take,
      userId: user.id,
    });
  }
}
