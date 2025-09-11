import { TAudio } from "./audio.type";
import { TFollow } from "./follows.type";
import { TLike } from "./like.type";
import { TPlaylist } from "./playlist-type";

export type TUser = {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string;
  username: string;
  displayUsername: string;
  audios: TAudio[];
  audiosCounts: number;
  createdAt: Date;
  updatedAt: Date;
  likedTracks: TLike[];
  playlists: TPlaylist[];
  firstName?: string;
  lastName?: string;
  city?: string;
  country?: string;
  bio?: string;
  following: TFollow[];
  followingCounts: number;
  followers: TFollow[];
  followersCounts: number;
  _count?: {
    audios?: number;
  };
};
