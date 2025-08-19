import { AuthGuard, AuthModule } from '@mguay/nestjs-better-auth';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { bearer, openAPI } from 'better-auth/plugins';
import { MemoryStoredFile, NestjsFormDataModule } from 'nestjs-form-data';
import { AudioModule } from './modules/audio/audio.module';
import { UsersModule } from './modules/users/users.module';
import { DatabaseModule } from './shared/database/database.module';
import { DatabaseService } from './shared/database/database.service';
import { FileUploadModule } from './shared/file-upload/file-upload.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule.forRootAsync({
      imports: [DatabaseModule, ConfigModule],
      useFactory: (
        database: DatabaseService,
        configService: ConfigService,
      ) => ({
        auth: betterAuth({
          database: prismaAdapter(database, { provider: 'postgresql' }),
          plugins: [openAPI(), bearer()],
          emailAndPassword: {
            enabled: false,
          },
          socialProviders: {
            github: {
              clientId: configService.getOrThrow<'string'>('GITHUB_CLIENT_ID'),
              clientSecret: configService.getOrThrow<'string'>(
                'GITHUB_CLIENT_SECRET',
              ),
              prompt: 'consent',
            },
            google: {
              clientId: configService.getOrThrow<'string'>('GOOGLE_CLIENT_ID'),
              clientSecret: configService.getOrThrow<'string'>(
                'GOOGLE_CLIENT_SECRET',
              ),
              prompt: 'consent',
            },
          },
          trustedOrigins: [configService.getOrThrow<string>('FRONTEND_URL')],
          telemetry: {
            debug: true,
          },
        }),
      }),
      inject: [DatabaseService, ConfigService],
    }),
    NestjsFormDataModule.config({
      isGlobal: true,
      storage: MemoryStoredFile,
    }),
    FileUploadModule,
    UsersModule,
    AudioModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
// export class AppModule implements NestModule {
//   configure(consumer: MiddlewareConsumer) {
//     consumer.apply(LoggerMiddleware).forRoutes('*');
//   }
// }
