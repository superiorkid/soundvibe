import { TAudio } from "./audio.type";
import { TUser } from "./user.type";

export type TListeningHistory = {
  id: string;
  userId: string;
  user: TUser;
  audioId: string;
  audio: TAudio;
  listenedAt: Date;
};
