import { TAudio } from "./audio.type";
import { TUser } from "./user.type";

export type TRepost = {
  id: string;
  createdAt: Date;
  userId: string;
  user?: TUser;
  audioId: string;
  audio?: TAudio;
};
