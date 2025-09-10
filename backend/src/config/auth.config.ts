import { ConfigService } from '@nestjs/config';
import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import {
  bearer,
  createAuthMiddleware,
  customSession,
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
      plugins: [
        openAPI(),
        bearer(),
        username(),
        customSession(async ({ user, session }) => {
          const userData = await database.user.findFirst({
            where: { id: user.id },
            include: {
              likedTracks: true,
              playlists: {
                orderBy: { updatedAt: 'desc' },
                take: 3,
                include: {
                  playlistCoverFile: true,
                },
              },
            },
          });

          return {
            session,
            user: {
              ...user,
              likedTracks: userData?.likedTracks,
              playlists: userData?.playlists,
              firstName: userData?.firstName,
              lastName: userData?.lastName,
              bio: userData?.bio,
              city: userData?.city,
              country: userData?.country,
            },
          };
        }),
      ],
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
          if (
            session?.user &&
            (!session.user.username || !session.user.displayUsername)
          ) {
            const {
              user: { name, id },
            } = session;

            const baseUsername = slugify(name, {
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
