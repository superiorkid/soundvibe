import { Session, type UserSession } from '@mguay/nestjs-better-auth';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Param,
  Post,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { CommentDTO } from './comment.dto';
import { CommentService } from './comment.service';

@Controller('comments/:audioId')
@ApiTags('Comments')
export class CommentController {
  protected logger = new Logger(CommentController.name);

  constructor(private commentService: CommentService) {}

  @Get()
  @ApiParam({
    name: 'audioId',
    description: '',
  })
  @ApiOperation({})
  @ApiOkResponse({})
  @ApiInternalServerErrorResponse({})
  async getComments(@Param('audioId') audioId: string) {
    return this.commentService.getComments(audioId);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiParam({
    name: 'audioId',
    description: '',
  })
  @ApiOperation({})
  @ApiBody({})
  @ApiCreatedResponse({})
  @ApiInternalServerErrorResponse({})
  @ApiBadRequestResponse({})
  async createComment(
    @Session() session: UserSession,
    @Body() commentDto: CommentDTO,
    @Param('audioId') audioId: string,
  ) {
    this.logger.log(commentDto);
    const userId = session.user.id;
    return this.commentService.createComment({ userId, audioId, commentDto });
  }

  @Delete(':commentId')
  @ApiParam({
    name: 'audioId',
    description: '',
  })
  @ApiOperation({})
  @ApiParam({ name: 'audioId' })
  @ApiParam({ name: 'commentId' })
  @ApiNotFoundResponse({})
  @ApiOkResponse({})
  @ApiInternalServerErrorResponse({})
  async deleteComment(
    @Param('audioId') audioId: string,
    @Param('commentId') commentId: string,
  ) {
    return this.commentService.deleteComment({ audioId, commentId });
  }
}
