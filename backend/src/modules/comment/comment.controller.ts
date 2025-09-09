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
  Query,
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
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { CommentDTO } from './comment.dto';
import { CommentService } from './comment.service';
import { CommentFilterEnum } from 'src/common/enums/comment-filter.enum';

@Controller({ path: 'audio/:audioId/comments', version: '1' })
@ApiTags('Comments')
export class CommentController {
  protected logger = new Logger(CommentController.name);

  constructor(private commentService: CommentService) {}

  @Get()
  @ApiParam({
    name: 'audioId',
    description: 'The ID of the audio to retrieve comments for.',
  })
  @ApiOperation({ summary: 'Get comments for an audio' })
  @ApiOkResponse({ description: 'Comments retrieved successfully.' })
  @ApiInternalServerErrorResponse({ description: 'Server error.' })
  @ApiQuery({
    name: 'filter',
    enum: CommentFilterEnum,
    required: false,
    description: 'Filter comments by enum (newest, oldest, trackTime).',
  })
  async getComments(
    @Param('audioId') audioId: string,
    @Query('filter') filter: CommentFilterEnum,
  ) {
    return this.commentService.getComments({ audioId, filter });
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiParam({
    name: 'audioId',
    description: 'The ID of the audio to add a comment to.',
  })
  @ApiOperation({ summary: 'Create a new comment' })
  @ApiBody({ description: 'The comment data to be created.' })
  @ApiCreatedResponse({ description: 'Comment created successfully.' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error.' })
  @ApiBadRequestResponse({ description: 'Invalid comment data provided.' })
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
    description: 'The ID of the audio containing the comment.',
  })
  @ApiParam({
    name: 'commentId',
    description: 'The ID of the comment to delete.',
  })
  @ApiOperation({ summary: 'Delete a comment' })
  @ApiNotFoundResponse({ description: 'Audio or comment not found.' })
  @ApiOkResponse({ description: 'Comment deleted successfully.' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error.' })
  async deleteComment(
    @Param('audioId') audioId: string,
    @Param('commentId') commentId: string,
  ) {
    return this.commentService.deleteComment({ audioId, commentId });
  }

  @Post(':commentId/like')
  @HttpCode(HttpStatus.CREATED)
  @ApiParam({
    name: 'audioId',
    description: 'The ID of the audio containing the comment.',
  })
  @ApiParam({
    name: 'commentId',
    description: 'The ID of the comment to like.',
  })
  @ApiOperation({ summary: 'Like a comment' })
  @ApiCreatedResponse({ description: 'Comment liked successfully.' })
  @ApiNotFoundResponse({ description: 'Audio or comment not found.' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error.' })
  async likeComment(
    @Param('audioId') audioId: string,
    @Param('commentId') commentId: string,
    @Session() session: UserSession,
  ) {
    console.log('audioId', audioId);
    console.log('commentId', commentId);
    return this.commentService.likeComment({
      audioId,
      commentId,
      userId: session.user.id,
    });
  }

  @Delete(':commentId/unlike')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiParam({
    name: 'audioId',
    description: 'The ID of the audio containing the comment.',
  })
  @ApiParam({
    name: 'commentId',
    description: 'The ID of the comment to unlike.',
  })
  @ApiOperation({ summary: 'Unlike a comment' })
  @ApiOkResponse({ description: 'Comment unliked successfully.' })
  @ApiNotFoundResponse({ description: 'Audio or comment not found.' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error.' })
  async unlikeComment(
    @Param('audioId') audioId: string,
    @Param('commentId') commentId: string,
    @Session() session: UserSession,
  ) {
    return this.commentService.unlikeComment({
      audioId,
      commentId,
      userId: session.user.id,
    });
  }
}
