import { TAudio } from "./audio.type";
import { TCommentLike } from "./comment-like.type";
import { TUser } from "./user.type";

export type TComment = {
  id: string;
  content: string;
  timestamp: number;
  createdAt: Date;
  updatedAt: Date;
  likesCount: number;
  audioId: string;
  audio: TAudio;
  userId: string;
  parentId: number;
  replies: TComment[];
  commentLikes: TCommentLike[];
  user: TUser;
};
