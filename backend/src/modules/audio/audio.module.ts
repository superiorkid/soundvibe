import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/shared/database/database.module';
import { FileUploadModule } from 'src/shared/file-upload/file-upload.module';
import { AudioController } from './audio.controller';
import { AudioRepository } from './audio.repository';
import { AudioService } from './audio.service';

@Module({
  imports: [DatabaseModule, FileUploadModule],
  providers: [AudioRepository, AudioService],
  controllers: [AudioController],
  exports: [AudioRepository],
})
export class AudioModule {}
