import { forwardRef, Module } from '@nestjs/common';
import { DatabaseModule } from 'src/shared/database/database.module';
import { UsersController } from './users.controller';
import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';
import { CommentModule } from '../comment/comment.module';
import { AudioModule } from '../audio/audio.module';
import { RepostModule } from '../repost/repost.module';

@Module({
  imports: [
    DatabaseModule,
    forwardRef(() => CommentModule),
    forwardRef(() => AudioModule),
    RepostModule,
  ],
  providers: [UsersRepository, UsersService],
  controllers: [UsersController],
  exports: [UsersRepository],
})
export class UsersModule {}
