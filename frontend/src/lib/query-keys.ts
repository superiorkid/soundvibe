export const authKeys = {
  session: ["session"] as const,
};

export const audioKeys = {
  all: ["audio"] as const,
  detailById: (audioId: string) => [...audioKeys.all, { audioId }],
  detailBySlug: (slug: string) => [...audioKeys.all, { slug }],
  recentLiked: (limit: number) => [...audioKeys.all, { limit }],
  usersLikesAudio: (params: { slug: string; limit: number }) => [
    ...audioKeys.all,
    { ...params, mode: "users-who-likes-audio" },
  ],
};

export const genreKeys = {
  all: ["genre"] as const,
};
