import z from "zod";

export const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
export const MAX_COVER_SIZE = 3 * 1024 * 1024;

const playlistType = ["public", "private"] as const;

export const createPlaylistSchema = z.object({
  title: z.string().min(1, { error: "playlist title is required" }),
  type: z.enum(playlistType),
});

export const updatePlaylistSchema = z.object({
  cover: z
    .instanceof(File)
    .refine((file) => {
      return !file || file.size <= MAX_COVER_SIZE;
    }, "File size must be less than 3MB")
    .refine((file) => {
      return ACCEPTED_IMAGE_TYPES.includes(file.type);
    }, "File must be a PNG")
    .optional(),
});

export type TCreatePlaylistSchema = z.infer<typeof createPlaylistSchema>;
export type TUpdatePlaylistSchema = z.infer<typeof updatePlaylistSchema>;
