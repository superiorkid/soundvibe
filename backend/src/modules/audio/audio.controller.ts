import { Public, Session, type UserSession } from '@mguay/nestjs-better-auth';
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  NotFoundException,
  Param,
  ParseBoolPipe,
  Post,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
  ApiConsumes,
  ApiHeader,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiPartialContentResponse,
  ApiPayloadTooLargeResponse,
  ApiProduces,
  ApiQuery,
  ApiTags,
  ApiUnsupportedMediaTypeResponse,
} from '@nestjs/swagger';
import type { Request, Response } from 'express';
import { FormDataRequest } from 'nestjs-form-data';
import { UsersRepository } from '../users/users.repository';
import { AudioService } from './audio.service';
import { UploadAudioDTO } from './dto/upload-audio.dto';

@Controller({ version: '1', path: 'audio' })
@ApiTags('audios')
export class AudioController {
  protected readonly logger = new Logger(AudioController.name);

  constructor(
    private audioService: AudioService,
    private userRepository: UsersRepository,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @FormDataRequest()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Upload a new audio track',
    type: UploadAudioDTO,
  })
  @ApiOperation({
    summary: 'Upload a new audio track',
    description:
      'Uploads an audio file with metadata including title, description, cover image, and audio file. The audio will be processed and made available for streaming.',
  })
  @ApiConflictResponse({
    description: 'Audio with this title already exists.',
    schema: {
      example: {
        statusCode: 409,
        message: 'Audio with this title already exists.',
        error: 'Conflict',
      },
    },
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong',
    schema: {
      example: {
        statusCode: 500,
        message: 'Something went wrong',
        error: 'Internal Server Error',
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid file format or missing required fields',
    schema: {
      example: {
        statusCode: 400,
        message: [
          'audioFile must be a file',
          'audioFile size must be less than 104857600 bytes',
          'Invalid file format. Accepted types: audio/wav, audio/x-wav, audio/flac, audio/x-flac, audio/aiff, audio/x-aiff, audio/alac, audio/x-alac, audio/mpeg, audio/mp3',
        ],
        error: 'Bad Request',
      },
    },
  })
  @ApiPayloadTooLargeResponse({
    description: 'File size exceeds maximum allowed limit',
    schema: {
      example: {
        statusCode: 413,
        message: 'File too large',
        error: 'Payload Too Large',
      },
    },
  })
  @ApiUnsupportedMediaTypeResponse({
    description: 'Unsupported file format',
    schema: {
      example: {
        statusCode: 415,
        message: 'Unsupported media type',
        error: 'Unsupported Media Type',
      },
    },
  })
  @ApiBearerAuth()
  async uploadTrack(
    @Session() session: UserSession,
    @Body() uploadAudioDto: UploadAudioDTO,
  ) {
    return this.audioService.uploadTrack(uploadAudioDto, session);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get all audio tracks for current user',
    description:
      'Retrieves a feed of audio tracks from the current user and users they follow. Includes optional reposts from followed users.',
  })
  @ApiOkResponse({
    description: 'Successfully retrieved audio tracks',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error occurred while fetching tracks',
    schema: {
      example: {
        statusCode: 500,
        message: 'Internal server error',
        error: 'Internal Server Error',
      },
    },
  })
  @ApiQuery({
    name: 'showRepost',
    required: false,
    type: Boolean,
    description:
      'Whether to include reposts from followed users (default: true)',
    example: true,
  })
  @ApiBearerAuth()
  async allTracks(
    @Session() session: UserSession,
    @Query('showRepost') showRepost: boolean = true,
  ) {
    return this.audioService.allAudios({ showRepost, userId: session.user.id });
  }

  @Get('liked/recent')
  @ApiOperation({
    summary: 'Get recent liked tracks and playlists',
    description:
      'Retrieves recently liked audio tracks and optionally playlists for a user. Supports search filtering and pagination.',
  })
  @ApiOkResponse({
    description: 'Successfully retrieved recent liked items',
  })
  @ApiNotFoundResponse({
    description: 'User not found',
    schema: {
      example: {
        statusCode: 404,
        message: 'user not found',
        error: 'Not Found',
      },
    },
  })
  @ApiInternalServerErrorResponse({
    description: 'Failed to retrieve recent liked tracks',
    schema: {
      example: {
        statusCode: 500,
        message: 'Failed to retrieve recent liked tracks.',
        error: 'Internal Server Error',
      },
    },
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Maximum number of items to return (default: 10)',
    example: 10,
  })
  @ApiQuery({
    name: 'query',
    required: false,
    type: String,
    description: 'Search query to filter by title, artist, or description',
    example: 'summer',
  })
  @ApiQuery({
    name: 'username',
    required: false,
    type: String,
    description: 'Username to get likes for (default: current user)',
    example: 'musiclover123',
  })
  @ApiQuery({
    name: 'withPlaylist',
    required: false,
    type: Boolean,
    description:
      'Whether to include liked playlists in results (default: false)',
    example: true,
  })
  @ApiBearerAuth()
  async recentLikedTracks(
    @Query('limit') limit: number = 10,
    @Query('query') query: string,
    @Query('username') username: string,
    @Query('withPlaylist', ParseBoolPipe) withPlaylist: boolean = false,
    @Session() session: UserSession,
  ) {
    const user = username
      ? await this.userRepository.findOne({
          where: { displayUsername: username },
        })
      : session.user;

    if (!user) throw new NotFoundException('user not found');

    return this.audioService.getRecentLikedTracks({
      limit,
      query,
      withPlaylist,
      userId: user.id,
    });
  }

  @Get('slug/:slug')
  @HttpCode(HttpStatus.OK)
  @Public()
  @ApiOperation({
    summary: 'Get audio by slug',
    description:
      'Retrieves audio details including user, tags, files, genre, and counts using the slug identifier',
  })
  @ApiParam({
    name: 'slug',
    description: 'The unique slug identifier of the audio track',
    example: 'my-first-track',
    type: String,
  })
  @ApiOkResponse({
    description: 'Audio details retrieved successfully',
  })
  @ApiNotFoundResponse({
    description: 'Audio track not found',
    schema: {
      example: {
        statusCode: 404,
        message: 'Audio not found',
        error: 'Not Found',
      },
    },
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error while retrieving audio details',
    schema: {
      example: {
        statusCode: 500,
        message: 'Internal server error',
        error: 'Internal Server Error',
      },
    },
  })
  async findAudioBySlug(@Param('slug') slug: string) {
    return this.audioService.detailAudioBySlug(slug);
  }

  @Public()
  @Get('stream/:id')
  @ApiOperation({
    summary: 'Stream audio file',
    description:
      'Streams an audio file with support for byte-range requests (partial content) for efficient streaming. Supports HTTP Range headers for seeking and buffering.',
  })
  @ApiParam({
    name: 'id',
    description: 'The ID of the audio file to stream',
    example: 'ckv8z1o1a0000r4d7h8f7xj9w',
    type: String,
  })
  @ApiOkResponse({
    description: 'Audio stream successfully',
    headers: {
      'Content-Type': {
        description: 'Audio MIME type',
        schema: { type: 'string', example: 'audio/mpeg' },
      },
      'Content-Length': {
        description: 'Total file size in bytes',
        schema: { type: 'integer', example: 10240000 },
      },
      'Accept-Ranges': {
        description: 'Indicates support for range requests',
        schema: { type: 'string', example: 'bytes' },
      },
      'Content-Range': {
        description: 'Range of bytes being returned (for partial content)',
        schema: { type: 'string', example: 'bytes 0-999999/10240000' },
      },
      'Cache-Control': {
        description: 'Cache directives',
        schema: { type: 'string', example: 'no-cache' },
      },
    },
    content: {
      'audio/mpeg': {
        schema: { type: 'string', format: 'binary' },
      },
    },
  })
  @ApiPartialContentResponse({
    description: 'Partial content response for range requests',
    headers: {
      'Content-Range': {
        description: 'Range of bytes being returned',
        schema: { type: 'string', example: 'bytes 0-999999/10240000' },
      },
      'Content-Length': {
        description: 'Size of the returned chunk in bytes',
        schema: { type: 'integer', example: 1000000 },
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Audio file not found',
    schema: {
      example: {
        statusCode: 404,
        message: 'Audio not found',
        error: 'Not Found',
      },
    },
  })
  @ApiInternalServerErrorResponse({
    description: 'Failed to stream audio file',
    schema: {
      example: {
        statusCode: 500,
        message: 'Failed to stream audio',
        error: 'Internal Server Error',
      },
    },
  })
  @ApiHeader({
    name: 'Range',
    description:
      'Optional byte range for partial content requests. Format: bytes=start-end',
    required: false,
    example: 'bytes=0-999999',
  })
  @ApiProduces('audio/mpeg')
  async streamAudio(
    @Param('id') id: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    return this.audioService.streamAudio({ id, req, res });
  }

  @Public()
  @Get('cover/:id')
  @ApiOperation({
    summary: 'Get audio cover image',
    description:
      'Retrieves the cover image for an audio track. Returns the image file directly as a stream.',
  })
  @ApiParam({
    name: 'id',
    description: 'The ID of the audio cover to retrieve',
    example: 'ckv8z1o1a0000r4d7h8f7xj9w',
    type: String,
  })
  @ApiOkResponse({
    description: 'Cover image retrieved successfully',
    headers: {
      'Content-Type': {
        description: 'Image MIME type (JPEG, PNG, or WEBP)',
        schema: { type: 'string', example: 'image/jpeg' },
      },
      'Content-Length': {
        description: 'Image file size in bytes',
        schema: { type: 'integer', example: 102400 },
      },
      'Cache-Control': {
        description: 'Cache directives',
        schema: { type: 'string', example: 'no-cache' },
      },
    },
    content: {
      'image/jpeg': {
        schema: { type: 'string', format: 'binary' },
      },
      'image/png': {
        schema: { type: 'string', format: 'binary' },
      },
      'image/webp': {
        schema: { type: 'string', format: 'binary' },
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Cover image not found',
    schema: {
      example: {
        statusCode: 404,
        message: 'Cover not found',
        error: 'Not Found',
      },
    },
  })
  @ApiInternalServerErrorResponse({
    description: 'Cover file not accessible',
    schema: {
      example: {
        statusCode: 404,
        message: 'Cover file not accessible',
        error: 'Not Found',
      },
    },
  })
  @ApiProduces('image/jpeg, image/png, image/webp')
  async getCover(@Param('id') id: string, @Res() res: Response) {
    return this.audioService.getCover({ id, res });
  }

  @Get('/slug/:slug/like/users')
  @ApiOperation({
    summary: 'Get all users who liked an audio track',
    description:
      'Returns a paginated list of users that liked the given audio track, ordered by most recent likes first.',
  })
  @ApiParam({
    name: 'slug',
    description: 'The slug of the audio track',
    example: 'my-first-track',
    type: String,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Maximum number of users to return (default: 25, max: 100)',
    example: 10,
  })
  @ApiOkResponse({
    description: 'Successfully retrieved users who liked the audio track',
  })
  @ApiNotFoundResponse({
    description: 'Audio track not found',
    schema: {
      example: {
        statusCode: 404,
        message: 'Audio track with slug "my-first-track" not found.',
        error: 'Not Found',
      },
    },
  })
  @ApiInternalServerErrorResponse({
    description: 'Failed to retrieve users who liked the audio track',
    schema: {
      example: {
        statusCode: 500,
        message:
          'Failed to retrieve users who liked the audio track. Please try again later.',
        error: 'Internal Server Error',
      },
    },
  })
  @ApiBearerAuth()
  async getUsersWhoLiked(
    @Param('slug') slug: string,
    @Query('limit') limit: number = 10,
  ) {
    return this.audioService.getUsersWhoLikedAudio({ slug, limit });
  }

  @Get(':id/playlists')
  @ApiOperation({
    summary: 'Get playlists containing an audio track',
    description:
      'Retrieves playlists that contain the specified audio track, ordered by most recently created playlists first.',
  })
  @ApiParam({
    name: 'id',
    description: 'The ID of the audio track',
    example: 'ckv8z1o1a0000r4d7h8f7xj9w',
    type: String,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Maximum number of playlists to return (default: 10, max: 50)',
    example: 5,
  })
  @ApiOkResponse({
    description: 'Successfully retrieved playlists containing the audio track',
  })
  @ApiNotFoundResponse({
    description: 'Audio track not found',
    schema: {
      example: {
        statusCode: 404,
        message: 'Audio not exists.',
        error: 'Not Found',
      },
    },
  })
  @ApiInternalServerErrorResponse({
    description: 'Failed to retrieve playlists',
    schema: {
      example: {
        statusCode: 500,
        message: 'Failed to retrieve playlists',
        error: 'Internal Server Error',
      },
    },
  })
  @ApiBearerAuth()
  async getAudioPlaylists(
    @Param('id') id: string,
    @Query('limit') limit: number = 10,
  ) {
    return this.audioService.getTrackPlaylsts({
      audioId: id,
      limit,
    });
  }

  @Get(':id/reposted')
  @ApiOperation({
    summary: 'Get users who reposted an audio track',
    description:
      'Retrieves a list of users who reposted the specified audio track, ordered by most recent reposts first.',
  })
  @ApiParam({
    name: 'id',
    description: 'The ID of the audio track',
    example: 'ckv8z1o1a0000r4d7h8f7xj9w',
    type: String,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Maximum number of reposts to return (default: 10, max: 50)',
    example: 5,
  })
  @ApiOkResponse({
    description: 'Successfully retrieved users who reposted the audio track',
  })
  @ApiNotFoundResponse({
    description: 'Audio track not found',
    schema: {
      example: {
        statusCode: 404,
        message: 'Audio not exists.',
        error: 'Not Found',
      },
    },
  })
  @ApiInternalServerErrorResponse({
    description: 'Failed to retrieve reposted users',
    schema: {
      example: {
        statusCode: 500,
        message: 'Failed to get reposted users.',
        error: 'Internal Server Error',
      },
    },
  })
  @ApiBearerAuth()
  async getTrackReposts(
    @Param('id') id: string,
    @Query('limit') limit: number = 10,
  ) {
    return this.audioService.getTrackReposted({
      limit,
      audioId: id,
    });
  }

  @Get(':id/fans')
  @ApiOperation({
    summary: 'Get top fans of an audio track',
    description:
      'Retrieves the top fans (users with most plays) of a specific audio track. Optionally filter by time period.',
  })
  @ApiParam({
    name: 'id',
    description: 'The ID of the audio track',
    example: 'ckv8z1o1a0000r4d7h8f7xj9w',
    type: String,
  })
  @ApiQuery({
    name: 'days',
    required: false,
    type: Number,
    description:
      'Number of days to look back for play counts (e.g., 7 for last week, 30 for last month). If not provided, considers all-time plays.',
    example: 30,
  })
  @ApiOkResponse({
    description: 'Successfully retrieved top fans',
  })
  @ApiNotFoundResponse({
    description: 'Audio track not found',
    schema: {
      example: {
        statusCode: 404,
        message: 'Audio not found',
        error: 'Not Found',
      },
    },
  })
  @ApiInternalServerErrorResponse({
    description: 'Failed to retrieve top fans',
    schema: {
      example: {
        statusCode: 500,
        message: 'Failed to retrieve top fans',
        error: 'Internal Server Error',
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid days parameter',
    schema: {
      example: {
        statusCode: 400,
        message: 'Days parameter must be a positive number',
        error: 'Bad Request',
      },
    },
  })
  @ApiBearerAuth()
  async getTopFans(@Param('id') id: string, @Query('days') days: number) {
    if (days && (days <= 0 || !Number.isInteger(days))) {
      throw new BadRequestException(
        'Days parameter must be a positive integer',
      );
    }

    return this.audioService.getTopFans({ audioId: id, limit: 5, days });
  }

  @Post(':id/like')
  @ApiOperation({
    summary: 'Like an audio track',
    description:
      'Adds a like to the specified audio track from the current user. Returns success if the like was added successfully.',
  })
  @ApiParam({
    name: 'id',
    description: 'The ID of the audio track to like',
    example: 'ckv8z1o1a0000r4d7h8f7xj9w',
    type: String,
  })
  @ApiOkResponse({
    description: 'Audio track liked successfully',
    schema: {
      example: {
        success: true,
        message: 'Audio track liked successfully',
      },
    },
  })
  @ApiConflictResponse({
    description: 'User has already liked this audio track',
    schema: {
      example: {
        statusCode: 409,
        message: 'You have already liked this audio track',
        error: 'Conflict',
      },
    },
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
    description: 'Failed to like audio track',
    schema: {
      example: {
        statusCode: 500,
        message: 'Failed to like audio track. Please try again later.',
        error: 'Internal Server Error',
      },
    },
  })
  @ApiBearerAuth()
  async likeAudio(@Param('id') id: string, @Session() session: UserSession) {
    const userId = session.user.id;
    return this.audioService.likeAudio({ userId, audioId: id });
  }

  @Delete(':id/unlike')
  @ApiOperation({
    summary: 'Unlike an audio track',
    description:
      'Removes a like from the specified audio track for the current user. Returns success if the unlike operation was completed successfully.',
  })
  @ApiParam({
    name: 'id',
    description: 'The ID of the audio track to unlike',
    example: 'ckv8z1o1a0000r4d7h8f7xj9w',
    type: String,
  })
  @ApiOkResponse({
    description: 'Audio track unliked successfully',
    schema: {
      example: {
        success: true,
        message: 'Audio track unliked successfully',
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'User has not liked this audio track yet',
    schema: {
      example: {
        statusCode: 404,
        message: 'You have not liked this audio track yet',
        error: 'Not Found',
      },
    },
  })
  @ApiInternalServerErrorResponse({
    description: 'Failed to unlike audio track',
    schema: {
      example: {
        statusCode: 500,
        message: 'Failed to unlike audio track. Please try again later.',
        error: 'Internal Server Error',
      },
    },
  })
  @ApiBearerAuth()
  async unlikeAudio(@Param('id') id: string, @Session() session: UserSession) {
    const userId = session.user.id;
    return this.audioService.unlikeAudio({ audioId: id, userId });
  }

  @Post(':id/play')
  @ApiOperation({
    summary: 'Increment audio play count',
    description:
      'Records a play event for the specified audio track. This increments the total play count and creates a play history record for the user.',
  })
  @ApiParam({
    name: 'id',
    description: 'The ID of the audio track to record a play for',
    example: 'ckv8z1o1a0000r4d7h8f7xj9w',
    type: String,
  })
  @ApiOkResponse({
    description: 'Play count incremented successfully',
    schema: {
      example: {
        success: true,
        message:
          'Play count incremented for audio ID "ckv8z1o1a0000r4d7h8f7xj9w".',
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Audio track not found',
    schema: {
      example: {
        statusCode: 404,
        message: 'Audio with ID "ckv8z1o1a0000r4d7h8f7xj9w" not found.',
        error: 'Not Found',
      },
    },
  })
  @ApiInternalServerErrorResponse({
    description: 'Failed to increment play count',
    schema: {
      example: {
        statusCode: 500,
        message:
          'Failed to increment play count for audio ID "ckv8z1o1a0000r4d7h8f7xj9w". Error: Database connection failed.',
        error: 'Internal Server Error',
      },
    },
  })
  @ApiBearerAuth()
  async incrementPlay(
    @Param('id') id: string,
    @Session() session: UserSession,
  ) {
    return this.audioService.incrementPlay(id, session.user.id);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get audio track details by ID',
    description:
      'Retrieves comprehensive details of an audio track including user information, tags, files, genre, likes, comments, and count statistics.',
  })
  @ApiParam({
    name: 'id',
    description: 'The ID of the audio track to retrieve',
    example: 'ckv8z1o1a0000r4d7h8f7xj9w',
    type: String,
  })
  @ApiOkResponse({
    description: 'Audio track details retrieved successfully',
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
    description: 'Failed to retrieve audio track details',
    schema: {
      example: {
        statusCode: 500,
        message: 'Internal server error while fetching audio details',
        error: 'Internal Server Error',
      },
    },
  })
  @ApiBearerAuth()
  async detailTrack(@Param('id') id: string) {
    return this.audioService.detailAudio(id);
  }
}
