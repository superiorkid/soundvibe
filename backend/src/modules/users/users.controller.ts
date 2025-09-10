import { Public, Session, type UserSession } from '@mguay/nestjs-better-auth';
import {
  Body,
  Controller,
  Get,
  Logger,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Query,
  Res,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { type Response } from 'express';
import { FormDataRequest } from 'nestjs-form-data';
import { UpdateUserProfileDTO } from './dto/update-user-profile.dto';
import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';

@Controller({ path: 'users', version: '1' })
@ApiTags('users')
export class UsersController {
  protected readonly logger = new Logger(UsersController.name);

  constructor(
    private usersService: UsersService,
    private userRepository: UsersRepository,
  ) {}

  @Patch()
  @FormDataRequest()
  async editUserProfile(
    @Body() updateUserProfileDto: UpdateUserProfileDTO,
    @Session() session: UserSession,
  ) {
    return this.usersService.updateUserProfile({
      updateUserProfileDto,
      userId: session.user.id,
    });
  }

  @Public()
  @Get('cover/:id')
  async getProfileImage(@Param('id') id: string, @Res() res: Response) {
    return this.usersService.getPofileImage({ id, res });
  }

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
