import { TLike } from "./like.type";

export type TUser = {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string;
  username: string;
  displayUsername: string;
  createdAt: Date;
  updatedAt: Date;
  likedTracks: TLike[];
};
