import { TAudioFile } from "./audio-file.type";
import { TComment } from "./comment.type";
import { TCoverFile } from "./cover-file.type";
import { TGenre } from "./genre.type";
import { TLike } from "./like.type";
import { TPlaylistLike } from "./playlist-type";
import { TRepost } from "./repost.type";
import { TTag } from "./tag.type";
import { TUser } from "./user.type";

export type TAudio = {
  id: string;
  title: string;
  artist: string;
  slug: string;
  description: string;
  duration: number;
  userId: string;
  genreId: string;
  createdAt: Date;
  updatedAt: Date;
  audioFile: TAudioFile;
  user: TUser;
  genre: TGenre;
  coverFile: TCoverFile;
  streamUrl?: string;
  tags?: TTag[];
  likesCount: number;
  likes: TLike[];
  playsCount: number;
  commentsCount: number;
  comments: TComment[];
  repostsCount: number;
  reposts: TRepost[];
};

export type TRecentLike = TLike | TPlaylistLike;
