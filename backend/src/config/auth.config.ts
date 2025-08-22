import { ConfigService } from '@nestjs/config';
import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { bearer, openAPI, username } from 'better-auth/plugins';
import { DatabaseService } from 'src/shared/database/database.service';

export function createAuthConfig(
  database: DatabaseService,
  config: ConfigService,
) {
  return {
    auth: betterAuth({
      database: prismaAdapter(database, { provider: 'postgresql' }),
      plugins: [openAPI(), bearer(), username()],
      emailAndPassword: {
        enabled: false,
      },
      socialProviders: {
        github: {
          clientId: config.getOrThrow<string>('GITHUB_CLIENT_ID'),
          clientSecret: config.getOrThrow<string>('GITHUB_CLIENT_SECRET'),
          prompt: 'consent',
        },
        google: {
          clientId: config.getOrThrow<string>('GOOGLE_CLIENT_ID'),
          clientSecret: config.getOrThrow<string>('GOOGLE_CLIENT_SECRET'),
          prompt: 'consent',
        },
      },
      trustedOrigins: [config.getOrThrow<string>('FRONTEND_URL')],
      telemetry: { debug: true },
    }),
  };
}
