export const authKeys = {
  session: ["session"] as const,
};

export const audioKeys = {
  all: ["audio"] as const,
  detailById: (audioId: string) => [...audioKeys.all, { audioId }],
};
