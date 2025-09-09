import { forwardRef, Module } from '@nestjs/common';
import { DatabaseModule } from 'src/shared/database/database.module';
import { FileUploadModule } from 'src/shared/file-upload/file-upload.module';
import { AudioModule } from '../audio/audio.module';
import { PlaylistAudioRepository } from './playlist-audio.repository';
import { PlaylistCoverFileRepository } from './playlist-cover-file.repository';
import { PlaylistLikeRepository } from './playlist-like.repository';
import { PlaylistController } from './playlist.controller';
import { PlaylistRepository } from './playlist.repository';
import { PlaylistService } from './playlist.service';

@Module({
  imports: [DatabaseModule, forwardRef(() => AudioModule), FileUploadModule],
  controllers: [PlaylistController],
  providers: [
    PlaylistRepository,
    PlaylistService,
    PlaylistAudioRepository,
    PlaylistLikeRepository,
    PlaylistCoverFileRepository,
  ],
  exports: [
    PlaylistRepository,
    PlaylistAudioRepository,
    PlaylistLikeRepository,
    PlaylistCoverFileRepository,
  ],
})
export class PlaylistModule {}
