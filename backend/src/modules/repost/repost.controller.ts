import {
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RepostService } from './repost.service';
import { Session, type UserSession } from '@mguay/nestjs-better-auth';

@Controller('audio/:audioId/reposts')
@ApiTags('Reposts')
export class RepostController {
  constructor(private repostService: RepostService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async repost(
    @Param('audioId') audioId: string,
    @Session() session: UserSession,
  ) {
    return this.repostService.repost({ audioId, userId: session.user.id });
  }

  @Delete()
  async undoRepost(
    @Param('audioId') audioId: string,
    @Session() session: UserSession,
  ) {
    return this.repostService.undoRepost({ audioId, userId: session.user.id });
  }
}
