import { createAuthClient } from "better-auth/react";
import { username } from "better-auth/plugins";

import "dotenv/config";

export const authClient = createAuthClient({
  basePath: "/api/auth",
  plugins: [username()],
});
