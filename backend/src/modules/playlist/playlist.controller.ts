import { Session, type UserSession } from '@mguay/nestjs-better-auth';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PlaylistDTO } from './playlist.dto';
import { PlaylistService } from './playlist.service';

@Controller('playlists')
@ApiTags('Playlist')
export class PlaylistController {
  constructor(private playlistService: PlaylistService) {}

  @Get()
  async playlists(@Session() session: UserSession) {
    return this.playlistService.getPlaylists(session.user.id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createPlaylist(
    @Body() playlistDto: PlaylistDTO,
    @Session() session: UserSession,
  ) {
    return this.playlistService.createPlaylist({
      playlistDto,
      userId: session.user.id,
    });
  }

  @Get('slug/:slug')
  async detailPlaylistBySlug(@Param('slug') slug: string) {
    return this.playlistService.detailPlaylistBySlug(slug);
  }

  @Get(':id')
  async detailPlaylist(@Param('id') id: string) {
    return this.playlistService.detailPlaylist(id);
  }

  @Delete(':id')
  async deletePlaylist(
    @Session() session: UserSession,
    @Param('id') id: string,
  ) {
    return this.playlistService.deletePlaylist({ id, userId: session.user.id });
  }

  @Post(':id/repost')
  async repostPlaylist() {}
}
