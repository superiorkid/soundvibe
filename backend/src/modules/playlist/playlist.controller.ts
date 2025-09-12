import { Public, Session, type UserSession } from '@mguay/nestjs-better-auth';
import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import {
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PlaylistFilterEnum } from 'src/common/enums/playlist-filter.enum';
import { CreatePlaylistDTO } from './dto/create-playlist.dto';
import { PlaylistService } from './playlist.service';
import { type Response } from 'express';
import { UpdatePlaylistDTO } from './dto/update-playlist.dto';
import { FormDataRequest } from 'nestjs-form-data';

@Controller({ path: 'playlists', version: '1' })
@ApiTags('Playlist')
export class PlaylistController {
  constructor(private playlistService: PlaylistService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get current user playlists' })
  @ApiResponse({
    status: 200,
    description: 'Returns all playlists belonging to the current user',
  })
  async getCurrentUserPlaylists(
    @Session() session: UserSession,
    @Query('filter', new DefaultValuePipe(PlaylistFilterEnum.all))
    filter: PlaylistFilterEnum,
    @Query('query') query: string,
  ) {
    return this.playlistService.getPlaylists({
      filter,
      query,
      userId: session.user.id,
    });
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get playlists by user ID' })
  @ApiParam({ name: 'userId', description: 'ID of the user' })
  @ApiResponse({
    status: 200,
    description: 'Returns all public playlists for the specified user',
  })
  async getUserPlaylists(
    @Param('userId') userId: string,
    @Query('filter', new DefaultValuePipe(PlaylistFilterEnum.all))
    filter: PlaylistFilterEnum,
    @Query('query') query: string,
  ) {
    return this.playlistService.getPlaylists({ userId, filter, query });
  }

  @Get('user/:userId/others/:excludedId')
  @ApiOperation({
    summary: 'Get other playlists by user excluding a given playlist',
  })
  @ApiParam({ name: 'userId', description: 'ID of the user' })
  @ApiParam({ name: 'excludeId', description: 'ID of the playlist to exclude' })
  async getOtherPlaylistsByUserId(
    @Param('userId') userId: string,
    @Param('excludeId') excludedId: string,
    @Query('limit', new ParseIntPipe()) limit: number = 25,
  ) {
    return this.playlistService.getOtherPlaylistsByUserId({
      excludedId,
      limit,
      userId,
    });
  }

  @Public()
  @Get('cover/:id')
  async getCover(@Param('id') id: string, @Res() res: Response) {
    return this.playlistService.getCover({ id, res });
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new playlist' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Playlist successfully created',
  })
  async createPlaylist(
    @Body() playlistDto: CreatePlaylistDTO,
    @Session() session: UserSession,
  ) {
    return this.playlistService.createPlaylist({
      playlistDto,
      userId: session.user.id,
    });
  }

  @Get('slug/:slug')
  @ApiOperation({ summary: 'Get playlist by slug' })
  @ApiParam({ name: 'slug', description: 'Slug identifier of the playlist' })
  @ApiResponse({
    status: 200,
    description: 'Returns playlist details if accessible to the user',
  })
  async detailPlaylistBySlug(@Param('slug') slug: string) {
    return this.playlistService.detailPlaylistBySlug(slug);
  }

  @Get(':id/likes')
  @ApiOperation({ summary: 'Get users who liked a playlist' })
  @ApiParam({ name: 'id', description: 'ID of the playlist' })
  async whoLikedPlaylist(
    @Param('id') id: string,
    @Query('limit', new ParseIntPipe()) limit: number = 10,
  ) {
    return this.playlistService.getUsersWhoLikedPlaylist({
      limit,
      playlistId: id,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get playlist by ID' })
  @ApiParam({ name: 'id', description: 'ID of the playlist' })
  @ApiResponse({
    status: 200,
    description: 'Returns playlist details if accessible to the user',
  })
  async detailPlaylist(@Param('id') id: string) {
    return this.playlistService.detailPlaylist(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a playlist' })
  @ApiParam({ name: 'id', description: 'ID of the playlist to update' })
  @ApiConsumes('multipart/form-data')
  @FormDataRequest()
  async updatePlaylist(
    @Param('id') id: string,
    @Body() playlistDto: UpdatePlaylistDTO,
    @Session() session: UserSession,
  ) {
    return this.playlistService.updatePlaylist({
      id,
      userId: session.user.id,
      updatePlaylistDTO: playlistDto,
    });
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a playlist' })
  @ApiParam({ name: 'id', description: 'ID of the playlist to delete' })
  @ApiResponse({
    status: 200,
    description: 'Playlist successfully deleted',
  })
  async deletePlaylist(
    @Session() session: UserSession,
    @Param('id') id: string,
  ) {
    return this.playlistService.deletePlaylist({ id, userId: session.user.id });
  }

  @Post(':id/like')
  @HttpCode(HttpStatus.CREATED)
  async likePlaylist(@Param('id') id: string, @Session() session: UserSession) {
    return this.playlistService.likePlaylist({
      playlistId: id,
      userId: session.user.id,
    });
  }

  @Delete(':id/unlike')
  async unlikePlaylist(
    @Param('id') id: string,
    @Session() session: UserSession,
  ) {
    return this.playlistService.unlikePlaylist({
      playlistId: id,
      userId: session.user.id,
    });
  }

  @Post(':id/audio/:audioId')
  @ApiOperation({ summary: 'Add audio to playlist' })
  @ApiParam({ name: 'id', description: 'ID of the playlist' })
  @ApiResponse({
    status: 200,
    description: 'Audio successfully added to playlist',
  })
  @ApiResponse({
    status: 404,
    description: 'Playlist or audio not found',
  })
  @ApiResponse({
    status: 403,
    description: 'User does not have permission to modify this playlist',
  })
  async addAudioToPlaylist(
    @Param('id') playlistId: string,
    @Param('audioId') audioId: string,
    @Session() session: UserSession,
  ) {
    return this.playlistService.addAudioToPlaylist({
      playlistId,
      audioId,
      userId: session.user.id,
    });
  }

  @Delete(':id/audio/:audioId')
  @ApiOperation({ summary: 'Remove audio from playlist' })
  @ApiParam({ name: 'id', description: 'ID of the playlist' })
  @ApiParam({ name: 'audioId', description: 'ID of the audio to remove' })
  @ApiResponse({
    status: 200,
    description: 'Audio successfully removed from playlist',
  })
  @ApiResponse({
    status: 404,
    description: 'Playlist or audio not found',
  })
  @ApiResponse({
    status: 403,
    description: 'User does not have permission to modify this playlist',
  })
  async removeAudioFromPlaylist(
    @Param('id') playlistId: string,
    @Param('audioId') audioId: string,
    @Session() session: UserSession,
  ) {
    return this.playlistService.removeAudioFromPlaylist({
      audioId,
      playlistId,
      userId: session.user.id,
    });
  }
}
