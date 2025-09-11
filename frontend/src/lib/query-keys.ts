import { CommentFilterEnum } from "@/enums/comment-filter-enum";
import { PlaylistFilterEnum } from "@/enums/playlist-filter-enum";

export const authKeys = {
  session: ["session"] as const,
};

export const audioKeys = {
  all: ["audio"] as const,
  audioWithRepost: (showRepost: boolean) =>
    [...audioKeys.all, { showRepost }] as const,
  detailById: (audioId: string) => [...audioKeys.all, { audioId }] as const,
  detailBySlug: (slug: string) => [...audioKeys.all, { slug }] as const,
  recentLiked: (params: {
    limit: number;
    query?: string;
    username?: string;
    withPlaylist?: boolean;
  }) => {
    const { withPlaylist = false } = params;
    return [...audioKeys.all, { ...params, withPlaylist }] as const;
  },
  usersLikesAudio: (params: { slug: string; limit: number }) =>
    [...audioKeys.all, { ...params, mode: "users-who-likes-audio" }] as const,
  topFans: (audioId: string, days?: number) =>
    [
      ...audioKeys.all,
      "top-fans",
      { audioId, days: days ?? "all-time" },
    ] as const,
};

export const genreKeys = {
  all: ["genre"] as const,
};

export const commentKeys = {
  all: (audioId: string, filter?: CommentFilterEnum) =>
    ["comments", { audioId, ...(filter && { filter }) }] as const,
};

export const listeningHistoryKeys = {
  all: ["listening-history"] as const,
  audioWithLimit: (params: { take?: number; userId: string; query?: string }) =>
    [...listeningHistoryKeys.all, params] as const,
};

export const playlistKeys = {
  all: ["playlist"] as const,
  allCurrentUser: (params?: { query?: string; filter?: PlaylistFilterEnum }) =>
    [...playlistKeys.all, { user: "me", ...params }] as const,
  detailBySlug: (slug: string) => [...playlistKeys.all, { slug }] as const,
};

export const userKeys = {
  all: ["users"] as const,
  userByUsername: (username: string) =>
    [...userKeys.all, { username }] as const,
  recentComments: (params: { limit: number; username?: string }) =>
    [...userKeys.all, { ...params, mode: "recent-comments" }] as const,
  userTracks: (params: { username: string; filter: "popular" | "latest" }) =>
    [...userKeys.all, { ...params, mode: "user-tracks" }] as const,
  userRepostsTracks: (username: string) =>
    [...userKeys.all, { mode: "reposted-tracks", username }] as const,
  userPlaylists: (username: string) =>
    [...userKeys.all, { mode: "playlists-tracks", username }] as const,
};

export const followKeys = {
  all: ["follows"] as const,
  getFollowers: (userId: string) =>
    [...followKeys.all, { userId, mode: "get-followers" }] as const,
  getFollowing: (userId: string) =>
    [...followKeys.all, { userId, mode: "get-following" }] as const,
  getSuggestedUsers: (limit: number = 10) =>
    [...followKeys.all, { mode: "get-suggested-users", limit }] as const,
};
