import { Public, Session, type UserSession } from '@mguay/nestjs-better-auth';
import {
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
  ApiBody,
  ApiConflictResponse,
  ApiConsumes,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
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
  @ApiCreatedResponse({ description: 'Audio uploaded successfully' })
  @ApiConflictResponse({ description: 'Audio with this title already exists.' })
  @ApiInternalServerErrorResponse({ description: 'Something went wrong' })
  @ApiBadRequestResponse({
    description: 'Invalid file format or missing required fields',
  })
  async uploadTrack(
    @Session() session: UserSession,
    @Body() uploadAudioDto: UploadAudioDTO,
  ) {
    return this.audioService.uploadTrack(uploadAudioDto, session);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({})
  @ApiInternalServerErrorResponse({})
  @ApiOkResponse({})
  @ApiQuery({ name: 'showRepost', required: false, type: Boolean })
  async allTracks(@Query('showRepost') showRepost: boolean = true) {
    // TODO: findall audio by following user
    return this.audioService.allAudios({ showRepost });
  }

  @Get('liked/recent')
  async recentLikedTracks(
    @Query('limit') limit: number,
    @Query('query') query: string,
    @Query('username') username: string,
    @Query('withPlaylist', ParseBoolPipe) withPlaylist: boolean,
    @Session() session: UserSession,
  ) {
    const user = username
      ? await this.userRepository.findOne({
          where: { displayUsername: username },
        })
      : session.user;

    if (!user) throw new NotFoundException('user not found');

    return this.audioService.getRecentLikedTracks({
      userId: user.id,
      limit,
      query,
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
  })
  @ApiOkResponse({ description: '' })
  @ApiInternalServerErrorResponse({ description: '' })
  @ApiNotFoundResponse({ description: '' })
  async findAudioBySlug(@Param('slug') slug: string) {
    return this.audioService.detailAudioBySlug(slug);
  }

  @Public()
  @Get('stream/:id')
  @ApiParam({
    name: 'id',
    description: 'The ID of the audio file to stream',
  })
  async streamAudio(
    @Param('id') id: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    return this.audioService.streamAudio({ id, req, res });
  }

  @Public()
  @Get('cover/:id')
  @ApiParam({
    name: 'id',
    description: 'The ID of the audio cover to retrieve',
  })
  async getCover(@Param('id') id: string, @Res() res: Response) {
    return this.audioService.getCover({ id, res });
  }

  @Get(':id/fans')
  async getTopFans(@Param('id') id: string, @Query('days') days: number) {
    return this.audioService.getTopFans({ audioId: id, limit: 5, days });
  }

  @Post(':id/like')
  async likeAudio(@Param('id') id: string, @Session() session: UserSession) {
    const userId = session.user.id;
    return this.audioService.likeAudio({ userId, audioId: id });
  }

  @Get(':id/like/users')
  @ApiOperation({
    summary: 'Get all users who liked an audio track',
    description: 'Returns a list of users that liked the given audio track',
  })
  @ApiParam({
    name: 'slug',
    description: 'The slug of the audio track',
  })
  async getUsersWhoLiked(
    @Param('slug') slug: string,
    @Query('limit') limit: number,
  ) {
    const limitValue = limit || 25;
    return this.audioService.getUsersWhoLikedAudio({ slug, limit: limitValue });
  }

  @Delete(':id/unlike')
  async unlikeAudio(@Param('id') id: string, @Session() session: UserSession) {
    const userId = session.user.id;
    return this.audioService.unlikeAudio({ audioId: id, userId });
  }

  @Post(':id/play')
  async incrementPlay(
    @Param('id') id: string,
    @Session() session: UserSession,
  ) {
    return this.audioService.incrementPlay(id, session.user.id);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    name: 'id',
    description: 'The ID of the audio track to retrieve',
  })
  @ApiOkResponse({ description: '' })
  @ApiInternalServerErrorResponse({ description: '' })
  @ApiNotFoundResponse({ description: '' })
  async detailTrack(@Param('id') id: string) {
    return this.audioService.detailAudio(id);
  }
}
