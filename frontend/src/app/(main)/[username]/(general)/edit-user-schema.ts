import z from "zod";

export const MAX_COVER_SIZE = 1024 * 1024 * 3;
export const ACCEPTED_IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp"];

export const editUserSchema = z.object({
  displayName: z.string().min(1, { error: "Display name required." }),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  bio: z.string().optional(),
  newProfileImage: z
    .instanceof(File)
    .optional()
    .refine((file) => !file || file.size <= MAX_COVER_SIZE, {
      error: `Cover size must be less than ${MAX_COVER_SIZE / 1024 / 1024}MB`,
    })
    .refine((file) => !file || ACCEPTED_IMAGE_TYPES.includes(file.type), {
      error: "Invalid image format. Allowed: PNG, JPEG, WEBP",
    }),
  existingProfileImage: z.string().optional(),
});

export type TEditUserSchema = z.infer<typeof editUserSchema>;
