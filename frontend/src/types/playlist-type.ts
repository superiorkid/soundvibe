import { TAudio } from "./audio.type";
import { TUser } from "./user.type";

export type TPlaylist = {
  id: string;
  title: string;
  slug: string;
  type: "public" | "private";
  coverUrl?: string;
  userId: string;
  user: TUser;
  audios: TPlaylistAudio[];
  audioCount: number;
  likes: TPlaylistLike[];
  likeCount: number;
  createdAt: Date;
  updatedAt: Date;
};

export type TPlaylistAudio = {
  id: string;
  playlistId: string;
  playlist: TPlaylist;
  audioId: string;
  audio: TAudio;
  addedAt: Date;
};

export type TPlaylistLike = {
  id: string;
  playlistId: string;
  playlist: TPlaylist;
  userId: string;
  user: TUser;
  createdAt: Date;
};
