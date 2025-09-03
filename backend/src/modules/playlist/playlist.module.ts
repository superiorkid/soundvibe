import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/shared/database/database.module';
import { AudioModule } from '../audio/audio.module';
import { PlaylistController } from './playlist.controller';
import { PlaylistRepository } from './playlist.repository';
import { PlaylistService } from './playlist.service';
import { FileUploadModule } from 'src/shared/file-upload/file-upload.module';
import { PlaylistAudioRepository } from './playlist-audio.repository';
import { PlaylistLikeRepository } from './playlist-like.repository';

@Module({
  imports: [DatabaseModule, AudioModule, FileUploadModule],
  controllers: [PlaylistController],
  providers: [
    PlaylistRepository,
    PlaylistService,
    PlaylistAudioRepository,
    PlaylistLikeRepository,
  ],
  exports: [
    PlaylistRepository,
    PlaylistAudioRepository,
    PlaylistLikeRepository,
  ],
})
export class PlaylistModule {}
