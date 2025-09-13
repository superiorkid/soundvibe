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
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { CommentFilterEnum } from 'src/common/enums/comment-filter.enum';
import { CommentDTO } from './comment.dto';
import { CommentService } from './comment.service';

@Controller({ path: 'audio/:audioId/comments', version: '1' })
@ApiTags('Comments')
export class CommentController {
  protected logger = new Logger(CommentController.name);

  constructor(private commentService: CommentService) {}

  @Get()
  @ApiOperation({
    summary: 'Get comments for an audio track',
    description:
      'Retrieves comments for a specific audio track with optional filtering and nested replies structure.',
  })
  @ApiParam({
    name: 'audioId',
    description: 'The ID of the audio to retrieve comments for.',
    example: 'ckv8z1o1a0000r4d7h8f7xj9w',
    type: String,
  })
  @ApiQuery({
    name: 'filter',
    enum: CommentFilterEnum,
    required: false,
    description:
      'Filter comments by type (newest, oldest, trackTime). Default: newest',
    example: CommentFilterEnum.newest,
  })
  @ApiOkResponse({
    description: 'Comments retrieved successfully.',
  })
  @ApiNotFoundResponse({
    description: 'Audio track not found',
    schema: {
      example: {
        statusCode: 404,
        message: 'Audio track not found',
        error: 'Not Found',
      },
    },
  })
  @ApiInternalServerErrorResponse({
    description: 'Failed to retrieve comments',
    schema: {
      example: {
        statusCode: 500,
        message: 'Failed to fetch comments',
        error: 'Internal Server Error',
      },
    },
  })
  @ApiBearerAuth()
  async getComments(
    @Param('audioId') audioId: string,
    @Query('filter') filter: CommentFilterEnum = CommentFilterEnum.newest,
  ) {
    return this.commentService.getComments({ audioId, filter });
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create a new comment on an audio track',
    description:
      'Creates a new comment or reply on a specific audio track. Supports parent comments for nested replies.',
  })
  @ApiParam({
    name: 'audioId',
    description: 'The ID of the audio to add a comment to.',
    example: 'ckv8z1o1a0000r4d7h8f7xj9w',
    type: String,
  })
  @ApiBody({
    description: 'The comment data to be created.',
    type: CommentDTO,
    examples: {
      mainComment: {
        summary: 'Main comment example',
        value: {
          content:
            'This track is amazing! The production quality is outstanding.',
          timestamp: 45.2,
        },
      },
      replyComment: {
        summary: 'Reply comment example',
        value: {
          content: 'I completely agree! The bassline is incredible.',
          timestamp: 45.2,
          parentId: 'comment123',
        },
      },
    },
  })
  @ApiCreatedResponse({
    description: 'Comment created successfully',
    schema: {
      example: {
        success: true,
        message: 'Comment created successfully',
        data: {
          id: 'new_comment_id',
          content: 'This track is amazing!',
          timestamp: 45.2,
          parentId: null,
        },
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Audio track or parent comment not found',
    schema: {
      example: {
        statusCode: 404,
        message: 'Audio track not found',
        error: 'Not Found',
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid comment data provided',
    schema: {
      example: {
        statusCode: 400,
        message: ['content must be a string', 'timestamp must be a number'],
        error: 'Bad Request',
      },
    },
  })
  @ApiInternalServerErrorResponse({
    description: 'Failed to create comment',
    schema: {
      example: {
        statusCode: 500,
        message: 'Failed to create comment',
        error: 'Internal Server Error',
      },
    },
  })
  @ApiBearerAuth()
  async createComment(
    @Session() session: UserSession,
    @Body() commentDto: CommentDTO,
    @Param('audioId') audioId: string,
  ) {
    const userId = session.user.id;
    return this.commentService.createComment({ userId, audioId, commentDto });
  }

  @Delete(':commentId')
  @ApiOperation({
    summary: 'Delete a comment from an audio track',
    description:
      'Deletes a specific comment from an audio track and decrements the comment count. Also removes any associated replies and likes.',
  })
  @ApiParam({
    name: 'audioId',
    description: 'The ID of the audio containing the comment.',
    example: 'ckv8z1o1a0000r4d7h8f7xj9w',
    type: String,
  })
  @ApiParam({
    name: 'commentId',
    description: 'The ID of the comment to delete.',
    example: 'comment123',
    type: String,
  })
  @ApiOkResponse({
    description: 'Comment deleted successfully',
    schema: {
      example: {
        success: true,
        message: 'Comment deleted successfully',
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Audio track or comment not found',
    schema: {
      example: {
        statusCode: 404,
        message: 'Comment not found or does not belong to this audio track',
        error: 'Not Found',
      },
    },
  })
  @ApiForbiddenResponse({
    description: 'User not authorized to delete this comment',
    schema: {
      example: {
        statusCode: 403,
        message: 'You can only delete your own comments',
        error: 'Forbidden',
      },
    },
  })
  @ApiInternalServerErrorResponse({
    description: 'Failed to delete comment',
    schema: {
      example: {
        statusCode: 500,
        message: 'Failed to delete comment',
        error: 'Internal Server Error',
      },
    },
  })
  @ApiBearerAuth()
  async deleteComment(
    @Param('audioId') audioId: string,
    @Param('commentId') commentId: string,
  ) {
    return this.commentService.deleteComment({ audioId, commentId });
  }

  @Post(':commentId/like')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Like a comment on an audio track',
    description:
      'Adds a like to a specific comment. Users can only like a comment once.',
  })
  @ApiParam({
    name: 'audioId',
    description: 'The ID of the audio containing the comment.',
    example: 'ckv8z1o1a0000r4d7h8f7xj9w',
    type: String,
  })
  @ApiParam({
    name: 'commentId',
    description: 'The ID of the comment to like.',
    example: 'comment123',
    type: String,
  })
  @ApiCreatedResponse({
    description: 'Comment liked successfully',
    schema: {
      example: {
        success: true,
        message: 'Like added successfully',
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Audio track or comment not found',
    schema: {
      example: {
        statusCode: 404,
        message: 'Comment not found',
        error: 'Not Found',
      },
    },
  })
  @ApiConflictResponse({
    description: 'Comment already liked by this user',
    schema: {
      example: {
        statusCode: 409,
        message: 'Comment already liked by this user',
        error: 'Conflict',
      },
    },
  })
  @ApiInternalServerErrorResponse({
    description: 'Failed to like comment',
    schema: {
      example: {
        statusCode: 500,
        message: 'Failed to add like',
        error: 'Internal Server Error',
      },
    },
  })
  @ApiBearerAuth()
  async likeComment(
    @Param('audioId') audioId: string,
    @Param('commentId') commentId: string,
    @Session() session: UserSession,
  ) {
    return this.commentService.likeComment({
      audioId,
      commentId,
      userId: session.user.id,
    });
  }

  @Delete(':commentId/unlike')
  @HttpCode(HttpStatus.OK) // Changed from NO_CONTENT to OK since we return a response body
  @ApiOperation({
    summary: 'Unlike a comment on an audio track',
    description:
      'Removes a like from a specific comment. Users can only unlike comments they previously liked.',
  })
  @ApiParam({
    name: 'audioId',
    description: 'The ID of the audio containing the comment.',
    example: 'ckv8z1o1a0000r4d7h8f7xj9w',
    type: String,
  })
  @ApiParam({
    name: 'commentId',
    description: 'The ID of the comment to unlike.',
    example: 'comment123',
    type: String,
  })
  @ApiOkResponse({
    description: 'Comment unliked successfully',
    schema: {
      example: {
        success: true,
        message: 'Like removed successfully',
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Audio track, comment, or like not found',
    schema: {
      example: {
        statusCode: 404,
        message: 'Like not found for this user and comment',
        error: 'Not Found',
      },
    },
  })
  @ApiInternalServerErrorResponse({
    description: 'Failed to unlike comment',
    schema: {
      example: {
        statusCode: 500,
        message: 'Failed to remove like',
        error: 'Internal Server Error',
      },
    },
  })
  @ApiBearerAuth()
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
