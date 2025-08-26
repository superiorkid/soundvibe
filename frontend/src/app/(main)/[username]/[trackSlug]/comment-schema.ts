import z from "zod";

export const commentSchema = z.object({
  content: z.string().min(1, { error: "" }),
  timestamp: z.coerce.number({ error: "" }),
  parentId: z.string().optional(),
});

export type TCommentSchema = z.infer<typeof commentSchema>;
