import { forwardRef, Module } from '@nestjs/common';
import { DatabaseModule } from 'src/shared/database/database.module';
import { AudioModule } from '../audio/audio.module';
import { RepostController } from './repost.controller';
import { RepostRepository } from './repost.repository';
import { RepostService } from './repost.service';

@Module({
  imports: [DatabaseModule, forwardRef(() => AudioModule)],
  providers: [RepostRepository, RepostService],
  controllers: [RepostController],
  exports: [RepostRepository],
})
export class RepostModule {}
