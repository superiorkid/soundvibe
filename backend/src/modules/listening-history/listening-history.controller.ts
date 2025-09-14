import { Session, type UserSession } from '@mguay/nestjs-better-auth';
import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { ListeningHistoryService } from './listening-history.service';

@Controller({ version: '1' })
@ApiTags('Listening History')
export class ListeningHistoryController {
  constructor(private listeningHistoryService: ListeningHistoryService) {}

  @Throttle({ default: { limit: 60, ttl: 60000 } })
  @Get('users/:userId/listening-history')
  @ApiQuery({ name: 'take' })
  async getListeningHistory(
    @Query('take') take: number,
    @Query('query') query: string,
    @Param('userId') userId: string,
  ) {
    return this.listeningHistoryService.getListeningHistory({
      take,
      userId,
      query,
    });
  }

  // clear current user history
  @Delete('users/listening-history')
  async clearListeningHistory(@Session() session: UserSession) {
    return this.listeningHistoryService.clearListeningHistory(session.user.id);
  }

  @Post('listening-history/:audioId')
  @Throttle({ default: { limit: 60, ttl: 60000 } })
  @ApiParam({ name: 'audioId' })
  @HttpCode(HttpStatus.CREATED)
  async setListeningHistory(
    @Param('audioId') audioId: string,
    @Session() session: UserSession,
  ) {
    return this.listeningHistoryService.setListeningHistory({
      audioId,
      userId: session.user.id,
    });
  }
}
