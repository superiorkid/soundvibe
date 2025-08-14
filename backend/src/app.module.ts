import { AuthGuard, AuthModule } from '@mguay/nestjs-better-auth';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { UsersModule } from './modules/users/users.module';
import { DatabaseModule } from './shared/database/database.module';
import { DatabaseService } from './shared/database/database.service';

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
          emailAndPassword: {
            enabled: false,
          },
          socialProviders: {
            github: {
              clientId: configService.getOrThrow<'string'>('GITHUB_CLIENT_ID'),
              clientSecret: configService.getOrThrow<'string'>(
                'GITHUB_CLIENT_SECRET',
              ),
            },
            google: {
              clientId: configService.getOrThrow<'string'>('GOOGLE_CLIENT_ID'),
              clientSecret: configService.getOrThrow<'string'>(
                'GOOGLE_CLIENT_SECRET',
              ),
            },
          },
          trustedOrigins: ['http://localhost:3000'],
        }),
      }),
      inject: [DatabaseService, ConfigService],
    }),
    UsersModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
