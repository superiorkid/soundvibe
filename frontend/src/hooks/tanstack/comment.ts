import { TCommentSchema } from "@/app/(main)/[username]/[trackSlug]/comment-schema";
import { getQueryClient } from "@/lib/query-client";
import { commentKeys } from "@/lib/query-keys";
import { createComment, deleteComment, getComments } from "@/server/comment";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

const queryClient = getQueryClient();

export function useComments(audioId: string) {
  const { data: comments, isPending } = useQuery({
    queryKey: commentKeys.all(audioId),
    queryFn: async () => getComments(audioId),
    enabled: !!audioId,
  });

  return { comments, isPending };
}

export function useCreateComment({
  audioId,
  onSuccess,
}: {
  audioId: string;
  onSuccess: () => void;
}) {
  const { mutate, isPending } = useMutation({
    mutationFn: async (commentData: TCommentSchema) =>
      createComment({ audioId, commentSchema: commentData }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: commentKeys.all(audioId),
      });
      onSuccess?.();
    },
    onError: (error) => {
      toast.error("Failed to create comment", {
        description:
          error.message || "Unable to post your comment. Please try again.",
      });
    },
  });

  return { createCommentMutation: mutate, isPending };
}

export function useDeleteComment({
  audioId,
  commentId,
  onSuccess,
}: {
  audioId: string;
  commentId: string;
  onSuccess: () => void;
}) {
  const { mutate, isPending } = useMutation({
    mutationFn: async () => deleteComment({ audioId, commentId }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: commentKeys.all(audioId),
      });
      onSuccess?.();
    },
    onError: (error: Error) => {
      toast.error("Failed to delete comment", {
        description:
          error.message || "Unable to delete your comment. Please try again.",
      });
    },
  });

  return { deleteCommentMutation: mutate, isPending };
}
