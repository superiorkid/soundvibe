import { TUser } from "./user.type";

export type TSession = {
  session: {
    id: string;
    expiresAt: string;
    token: string;
    createdAt: Date;
    updatedAt: Date;
    ipAddress: string;
    userAgent: string;
    userId: string;
  };
  user: TUser;
};
