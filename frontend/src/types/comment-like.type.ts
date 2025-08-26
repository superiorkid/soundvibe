import { TComment } from "./comment.type";
import { TUser } from "./user.type";

export type TCommentLike = {
  id: string;
  userId: string;
  commentId: string;
  createdAt: Date;
  user: TUser;
  comment: TComment;
};
