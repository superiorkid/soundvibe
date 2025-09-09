import { Session, type UserSession } from '@mguay/nestjs-better-auth';
import {
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';

@Controller({ path: 'users', version: '1' })
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

  @Get('/tracks/:username')
  async getUserTracks(
    @Param('username') username: string,
    @Query('filter') filter: 'latest' | 'popular',
  ) {
    return this.usersService.getUserTracks({ filter, username });
  }

  @Get('/reposts/:username')
  async getUserReposts(@Param('username') username: string) {
    return this.usersService.getUserReposts(username);
  }

  @Get('/playlists/:username')
  async getUserPlaylists(@Param('username') username: string) {
    return this.usersService.getUserPlaylists(username);
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
