import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/shared/database/database.module';
import { FileUploadModule } from 'src/shared/file-upload/file-upload.module';
import { AudioController } from './audio.controller';
import { AudioRepository } from './audio.repository';
import { AudioService } from './audio.service';
import { LikeRepository } from './like.repository';

@Module({
  imports: [DatabaseModule, FileUploadModule],
  providers: [AudioRepository, LikeRepository, AudioService],
  controllers: [AudioController],
  exports: [AudioRepository],
})
export class AudioModule {}
