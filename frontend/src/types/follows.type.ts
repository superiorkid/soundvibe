import { TUser } from "./user.type";

export type TFollow = {
  id: string;
  followerId: string;
  followingId: string;
  follower?: TUser;
  following?: TUser;
  createdAt: Date;
};
