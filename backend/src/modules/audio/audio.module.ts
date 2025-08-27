import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/shared/database/database.module';
import { FileUploadModule } from 'src/shared/file-upload/file-upload.module';
import { UsersModule } from '../users/users.module';
import { AudioPlaysRepository } from './audio-plays.repository';
import { AudioController } from './audio.controller';
import { AudioRepository } from './audio.repository';
import { AudioService } from './audio.service';
import { LikeRepository } from './like.repository';

@Module({
  imports: [DatabaseModule, FileUploadModule, UsersModule],
  providers: [
    AudioRepository,
    LikeRepository,
    AudioService,
    AudioPlaysRepository,
  ],
  controllers: [AudioController],
  exports: [AudioRepository, AudioPlaysRepository, LikeRepository],
})
export class AudioModule {}
