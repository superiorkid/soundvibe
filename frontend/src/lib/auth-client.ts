import { createAuthClient } from "better-auth/react";

import "dotenv/config";

export const authClient = createAuthClient({
  basePath: "/api/auth",
});
