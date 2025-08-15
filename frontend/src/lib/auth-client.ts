import { createAuthClient } from "better-auth/react";

import "dotenv/config";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
});
