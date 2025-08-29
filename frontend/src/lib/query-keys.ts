import { CommentFilterEnum } from "@/enums/comment-filter-enum";

export const authKeys = {
  session: ["session"] as const,
};

export const audioKeys = {
  all: ["audio"] as const,
  audioWithRepost: (showRepost: boolean) => [...audioKeys.all, { showRepost }],
  detailById: (audioId: string) => [...audioKeys.all, { audioId }],
  detailBySlug: (slug: string) => [...audioKeys.all, { slug }],
  recentLiked: (limit: number) => [...audioKeys.all, { limit }],
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
