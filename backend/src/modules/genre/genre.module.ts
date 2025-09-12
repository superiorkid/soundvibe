import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/shared/database/database.module';
import { AudioModule } from '../audio/audio.module';
import { GenreController } from './genre.controller';
import { GenreRepository } from './genre.repository';
import { GenreService } from './genre.service';
import { PlaylistModule } from '../playlist/playlist.module';

@Module({
  imports: [DatabaseModule, AudioModule, PlaylistModule],
  providers: [GenreRepository, GenreService],
  controllers: [GenreController],
  exports: [GenreRepository],
})
export class GenreModule {}
