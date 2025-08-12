import z from "zod";

export const MAX_AUDIO_SIZE = 1024 * 1024 * 100;
export const ACCEPTED_AUDIO_TYPES = [
  "audio/wav",
  "audio/flac",
  "audio/aiff",
  "audio/x-aiff",
  "audio/alac",
  "audio/mp3",
  "audio/mpeg",
];

export const MAX_COVER_SIZE = 1024 * 1024 * 3;
export const ACCEPTED_IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp"];

export const uploadSchema = z.object({
  audio: z
    .instanceof(File, { error: "Audio file is required" })
    .refine((file) => file.size <= MAX_AUDIO_SIZE, {
      error: `Audio size must be less than ${MAX_AUDIO_SIZE / 1024 / 1024}MB`,
    })
    .refine((file) => ACCEPTED_AUDIO_TYPES.includes(file.type), {
      error: "Invalid audio format. Allowed: WAV, FLAC, AIFF, ALAC, MP3",
    }),
  title: z.string().min(1, { error: "Title is required" }),
  genre: z.string().min(1, { error: "Genre is required" }),
  additionalTags: z
    .array(z.object({ id: z.string().min(1), text: z.string().min(1) }))
    .optional(),
  description: z.string().min(1, { error: "Description is required" }),
  cover: z
    .instanceof(File)
    .optional()
    .refine((file) => !file || file.size <= MAX_COVER_SIZE, {
      error: `Cover size must be less than ${MAX_COVER_SIZE / 1024 / 1024}MB`,
    })
    .refine((file) => !file || ACCEPTED_IMAGE_TYPES.includes(file.type), {
      error: "Invalid image format. Allowed: PNG, JPEG, WEBP",
    }),
});

export type TUploadSchema = z.infer<typeof uploadSchema>;
