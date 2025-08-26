import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/shared/database/database.module';
import { CommentController } from './comment.controller';
import { CommentRepository } from './comment.repository';
import { CommentService } from './comment.service';
import { AudioModule } from '../audio/audio.module';

@Module({
  imports: [DatabaseModule, AudioModule],
  controllers: [CommentController],
  providers: [CommentRepository, CommentService],
  exports: [CommentRepository],
})
export class CommentModule {}
