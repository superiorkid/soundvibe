import { Session, type UserSession } from '@mguay/nestjs-better-auth';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Param,
  Post,
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
  ApiTags,
} from '@nestjs/swagger';
import type { Request, Response } from 'express';
import { FormDataRequest } from 'nestjs-form-data';
import { AudioService } from './audio.service';
import { UploadAudioDTO } from './dto/upload-audio.dto';

@Controller('audio')
@ApiTags('audios')
export class AudioController {
  protected readonly logger = new Logger(AudioController.name);

  constructor(private audioService: AudioService) {}

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
  async allTracks() {
    return this.audioService.allAudios();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiParam({ description: '', name: 'id' })
  @ApiOkResponse({ description: '' })
  @ApiInternalServerErrorResponse({ description: '' })
  @ApiNotFoundResponse({ description: '' })
  async detailTrack(@Param('id') id: string) {
    return this.audioService.detailAudio(id);
  }

  @Get('slug/:slug')
  @HttpCode(HttpStatus.OK)
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

  @Get('stream/:id')
  @ApiParam({ name: 'id' })
  async streamAudio(
    @Param('id') id: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    return this.audioService.streamAudio({ id, req, res });
  }
}
