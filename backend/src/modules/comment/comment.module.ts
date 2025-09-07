import { forwardRef, Module } from '@nestjs/common';
import { DatabaseModule } from 'src/shared/database/database.module';
import { AudioModule } from '../audio/audio.module';
import { CommentLikeRepository } from './coment-like.repository';
import { CommentController } from './comment.controller';
import { CommentRepository } from './comment.repository';
import { CommentService } from './comment.service';

@Module({
  imports: [DatabaseModule, forwardRef(() => AudioModule)],
  controllers: [CommentController],
  providers: [CommentRepository, CommentService, CommentLikeRepository],
  exports: [CommentRepository, CommentLikeRepository],
})
export class CommentModule {}
