import { ConfigService } from '@nestjs/config';
import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import {
  bearer,
  createAuthMiddleware,
  openAPI,
  username,
} from 'better-auth/plugins';
import slugify from 'slugify';
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
      hooks: {
        after: createAuthMiddleware(async (ctx) => {
          const session = ctx.context.session;
          console.log('session', JSON.stringify(session));

          if (
            session?.user &&
            (!session.user.username || !session.user.displayUsername)
          ) {
            console.log('inside session execute');

            const {
              user: { name, id },
            } = session;

            let baseUsername = slugify(name || 'random-user', {
              lower: true,
              strict: true,
            }).replace(/-/g, '');

            let username = baseUsername;
            let suffix = 1;
            while (
              await database.user.findFirst({
                where: { username },
              })
            ) {
              username = `${baseUsername}-${suffix++}`;
            }
            const user = await database.user.findUnique({ where: { id } });
            if (user) {
              console.log('username / displayUsername execute');
              await database.user.update({
                where: { id: user.id },
                data: {
                  username: user.username ?? username,
                  displayUsername: user.displayUsername ?? username,
                },
              });
            }
          }
        }),
      },
      trustedOrigins: [config.getOrThrow<string>('FRONTEND_URL')],
      telemetry: { debug: true },
    }),
  };
}
