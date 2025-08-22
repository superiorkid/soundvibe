// for migration purposess

import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { username } from 'better-auth/plugins';

export const auth = betterAuth({
  database: prismaAdapter({}, { provider: 'postgresql' }),
  plugins: [username()],
});
