import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/shared/database/database.module';
import { AudioModule } from '../audio/audio.module';
import { PlaylistModule } from '../playlist/playlist.module';
import { UsersModule } from '../users/users.module';
import { SearchController } from './search.controller';
import { SearchRepository } from './search.repository';
import { SearchService } from './search.service';

@Module({
  imports: [DatabaseModule, AudioModule, PlaylistModule, UsersModule],
  controllers: [SearchController],
  providers: [SearchService, SearchRepository],
  exports: [SearchRepository],
})
export class SearchModule {}
