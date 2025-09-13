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
  trackPlaylists: (params: { audioId: string; limit?: number }) =>
    [...audioKeys.all, { mode: "track-playlists", ...params }] as const,
  trackReposted: (params: { audioId: string; limit?: number }) =>
    [...audioKeys.all, { mode: "track-reposted", ...params }] as const,
};

export const genreKeys = {
  all: ["genre"] as const,
  latestTracks: (params: { name: string; limit?: number }) =>
    [...genreKeys.all, { mode: "latest-tracks", ...params }] as const,
  popularTracks: (params: { name: string; limit?: number }) =>
    [...genreKeys.all, { mode: "popular-tracks", ...params }] as const,
  playlists: (params: { name: string; limit?: number }) =>
    [...genreKeys.all, { mode: "playlsts", ...params }] as const,
};

export const commentKeys = {
  all: ["comments"] as const,
  allById: (audioId: string, filter?: CommentFilterEnum) =>
    [...commentKeys.all, { audioId, ...(filter && { filter }) }] as const,
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
  otherPlaylists: (params: {
    userId: string;
    excludedId: string;
    limit?: number;
  }) => [...playlistKeys.all, params],
  usersWhoLikedPlaylist: (params: { playlistId: string; limit?: number }) => [
    ...playlistKeys.all,
    { mode: "users-who-liked-playlst", ...params },
  ],
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
  getFollowersById: (userId: string) =>
    [...followKeys.all, { userId, mode: "get-followers" }] as const,
  getFollowingById: (params: { userId: string; filter?: string }) =>
    [...followKeys.all, { ...params, mode: "get-following" }] as const,
  getSuggestedUsers: (limit: number = 10) =>
    [...followKeys.all, { mode: "get-suggested-users", limit }] as const,
  getFollowersByUsername: (username: string) =>
    [...followKeys.all, { username, mode: "get-followers" }] as const,
  getFollowingByUsername: (params: { username: string; filter?: string }) =>
    [...followKeys.all, { ...params, mode: "get-following" }] as const,
};

export const searchKeys = {
  all: ["search"] as const,
  seachEverything: (params: { keyword: string; limit?: number }) =>
    [...searchKeys.all, params] as const,
};
