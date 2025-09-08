import { CommentFilterEnum } from "@/enums/comment-filter-enum";
import { PlaylistFilterEnum } from "@/enums/playlist-filter-enum";

export const authKeys = {
  session: ["session"] as const,
};

export const audioKeys = {
  all: ["audio"] as const,
  audioWithRepost: (showRepost: boolean) => [...audioKeys.all, { showRepost }],
  detailById: (audioId: string) => [...audioKeys.all, { audioId }],
  detailBySlug: (slug: string) => [...audioKeys.all, { slug }],
  recentLiked: (params: {
    limit: number;
    query?: string;
    username?: string;
  }) => [...audioKeys.all, params],
  usersLikesAudio: (params: { slug: string; limit: number }) => [
    ...audioKeys.all,
    { ...params, mode: "users-who-likes-audio" },
  ],
  topFans: (audioId: string, days?: number) => [
    ...audioKeys.all,
    "top-fans",
    { audioId, days: days ?? "all-time" },
  ],
};

export const genreKeys = {
  all: ["genre"] as const,
};

export const commentKeys = {
  all: (audioId: string, filter?: CommentFilterEnum) => [
    "comments",
    { audioId, ...(filter && { filter }) },
  ],
};

export const listeningHistoryKeys = {
  all: ["listening-history"] as const,
  audioWithLimit: (params: {
    take?: number;
    userId: string;
    query?: string;
  }) => [...listeningHistoryKeys.all, params],
};

export const playlistKeys = {
  all: ["playlist"] as const,
  allCurrentUser: (params?: {
    query?: string;
    filter?: PlaylistFilterEnum;
  }) => [...playlistKeys.all, { user: "me", ...params }],
  detailBySlug: (slug: string) => [...playlistKeys.all, { slug }],
};

export const userKeys = {
  all: ["users"] as const,
  userByUsername: (username: string) => [...userKeys.all, { username }],
  recentComments: (params: { limit: number; username?: string }) => [
    ...userKeys.all,
    { ...params, mode: "recent-comments" },
  ],
  userTracks: (params: { username: string; filter: "popular" | "latest" }) => [
    ...userKeys.all,
    { ...params, mode: "user-tracks" },
  ],
};
