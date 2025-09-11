import { TAudio } from "./audio.type";
import { TUser } from "./user.type";

export type TLike = {
  userId: string;
  user?: TUser;
  audioId: string;
  audio?: TAudio;
  created_at: Date;
  type?: "audio";
};
