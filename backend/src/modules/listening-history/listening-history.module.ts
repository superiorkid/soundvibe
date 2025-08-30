import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/shared/database/database.module';
import { ListeningHistoryController } from './listening-history.controller';
import { ListeningHistoryRepository } from './listening-history.repository,';
import { ListeningHistoryService } from './listening-history.service';
import { AudioModule } from '../audio/audio.module';

@Module({
  imports: [DatabaseModule, AudioModule],
  controllers: [ListeningHistoryController],
  providers: [ListeningHistoryRepository, ListeningHistoryService],
  exports: [ListeningHistoryRepository],
})
export class ListeningHistoryModule {}
