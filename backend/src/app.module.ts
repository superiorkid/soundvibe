import { AuthGuard, AuthModule } from '@mguay/nestjs-better-auth';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { MemoryStoredFile, NestjsFormDataModule } from 'nestjs-form-data';
import { LoggerMiddleware } from './common/middlewares/logger.middleware';
import { createAuthConfig } from './config/auth.config';
import { AudioModule } from './modules/audio/audio.module';
import { CommentModule } from './modules/comment/comment.module';
import { FollowModule } from './modules/follow/follow.module';
import { GenreModule } from './modules/genre/genre.module';
import { ListeningHistoryModule } from './modules/listening-history/listening-history.module';
import { PlaylistModule } from './modules/playlist/playlist.module';
import { RepostModule } from './modules/repost/repost.module';
import { SearchModule } from './modules/search/search.module';
import { UsersModule } from './modules/users/users.module';
import { DatabaseModule } from './shared/database/database.module';
import { DatabaseService } from './shared/database/database.service';
import { FileUploadModule } from './shared/file-upload/file-upload.module';

@Module({
  imports: [
    DatabaseModule,
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule.forRootAsync({
      imports: [DatabaseModule, ConfigModule],
      useFactory: (db: DatabaseService, config: ConfigService) =>
        createAuthConfig(db, config),
      inject: [DatabaseService, ConfigService],
    }),
    NestjsFormDataModule.config({
      isGlobal: true,
      storage: MemoryStoredFile,
    }),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000,
          limit: 25,
        },
      ],
    }),
    FileUploadModule,
    UsersModule,
    AudioModule,
    GenreModule,
    CommentModule,
    RepostModule,
    ListeningHistoryModule,
    PlaylistModule,
    FollowModule,
    SearchModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
