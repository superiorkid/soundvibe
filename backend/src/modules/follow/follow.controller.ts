import { Session, type UserSession } from '@mguay/nestjs-better-auth';
import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { FollowService } from './follow.service';

@Controller({ path: 'follows', version: '1' })
@ApiTags('follows')
export class FollowController {
  constructor(private followService: FollowService) {}

  @Get('username/:username/followers')
  @ApiOperation({ summary: 'Get followers of a user by username' })
  @ApiParam({ name: 'username', description: 'Username of the user' })
  async getFollowersByUsername(@Param('username') username: string) {
    return this.followService.getFollowersByUsername(username);
  }

  @Get('username/:username/following')
  @ApiOperation({ summary: 'Get users that a user is following by username' })
  @ApiParam({ name: 'username', description: 'Username of the user' })
  async getFollowingByUsername(
    @Param('username') username: string,
    @Query('filter') filter?: string,
  ) {
    return this.followService.getFollowingByUsername({ username, filter });
  }

  @ApiOperation({ summary: 'Get suggested users to follow' })
  @Get('suggested')
  async suggestedUsers(
    @Query('limit', ParseIntPipe) limit: 10,
    @Session() session: UserSession,
  ) {
    return this.followService.getSuggestedUsers({
      limit,
      currentUserId: session.user.id,
    });
  }

  @Post(':userId')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Follow a user' })
  @ApiParam({ name: 'userId', description: 'ID of the user to follow' })
  async followUser(
    @Session() session: UserSession,
    @Param('userId') userId: string,
  ) {
    return this.followService.follow(session.user.id, userId);
  }

  @Delete(':userId')
  @ApiOperation({ summary: 'Unfollow a user' })
  @ApiParam({ name: 'userId', description: 'ID of the user to unfollow' })
  async unfollowUser(
    @Session() session: UserSession,
    @Param('userId') userId: string,
  ) {
    return this.followService.unfollow(session.user.id, userId);
  }

  @Get(':userId/followers')
  @ApiOperation({ summary: 'Get followers of a user' })
  @ApiParam({ name: 'userId', description: 'ID of the user' })
  async getFollowers(@Param('userId') userId: string) {
    return this.followService.getFollowers(userId);
  }

  @Get(':userId/following')
  @ApiOperation({ summary: 'Get users that a user is following' })
  @ApiParam({ name: 'userId', description: 'ID of the user' })
  async getFollowing(
    @Param('userId') userId: string,
    @Query('filter') filter: string,
  ) {
    return this.followService.getFollowing({ userId, filter });
  }
}
