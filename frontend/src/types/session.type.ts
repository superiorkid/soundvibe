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
  user: {
    id: string;
    name: string;
    email: string;
    emailVerified: Date;
    image: string;
    createdAt: Date;
    updatedAt: Date;
  };
};
