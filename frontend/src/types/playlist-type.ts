import { TAudio } from "./audio.type";
import { TUser } from "./user.type";

export type TPlaylist = {
  id: string;
  title: string;
  slug: string;
  description?: string;
  type: "public" | "private";
  userId: string;
  user: TUser;
  audios: TPlaylistAudio[];
  audioCount: number;
  likes: TPlaylistLike[];
  likeCount: number;
  createdAt: Date;
  updatedAt: Date;
  playlistCoverFile?: TPlaylistCoverFile;
};

export type TPlaylistCoverFile = {
  id: string;
  url: string;
  alt?: string;
  playlistId: string;
  playlist: TPlaylist;
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
  playlist?: TPlaylist;
  userId: string;
  user?: TUser;
  createdAt: Date;
  type?: "playlist";
};
