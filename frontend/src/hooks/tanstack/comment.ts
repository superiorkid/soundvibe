"use client";

import { TCommentSchema } from "@/app/(main)/[username]/(detail)/[trackSlug]/comment-schema";
import { CommentFilterEnum } from "@/enums/comment-filter-enum";
import { getQueryClient } from "@/lib/query-client";
import { audioKeys, commentKeys } from "@/lib/query-keys";
import {
  createComment,
  deleteComment,
  getComments,
  likeComment,
  unlikeComment,
} from "@/server/comment";
import { TComment } from "@/types/comment.type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const queryClient = getQueryClient();

export function useComments(params: {
  audioId: string;
  filter: CommentFilterEnum;
}) {
  const { audioId, filter } = params;
  const { data: comments, isPending } = useQuery({
    queryKey: commentKeys.allById(audioId, filter),
    queryFn: async () => getComments({ audioId, filter }),
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
        queryKey: commentKeys.allById(audioId),
      });
      queryClient.invalidateQueries({
        queryKey: audioKeys.all,
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
        queryKey: commentKeys.allById(audioId),
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

export function useCommentLike(
  comment: TComment,
  userId: string,
  audioId: string
) {
  const queryClient = useQueryClient();
  const hasLiked = !!comment?.commentLikes?.some(
    (like) => like.userId === userId
  );

  const hasLikedByAuthor = !!comment?.commentLikes?.some(
    (like) => like.userId === comment.audio.userId
  );

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      if (hasLiked) {
        return unlikeComment({ audioId, commentId: comment.id });
      }
      return likeComment({ audioId, commentId: comment.id });
    },
    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: commentKeys.allById(audioId),
      });

      const prevData = queryClient.getQueryData<TComment[]>(
        commentKeys.allById(audioId)
      );

      if (prevData) {
        queryClient.setQueryData<TComment[]>(
          commentKeys.allById(audioId),
          prevData.map((c) =>
            c.id === comment.id
              ? {
                  ...c,
                  likesCount: hasLiked ? c.likesCount - 1 : c.likesCount + 1,
                  likes: hasLiked
                    ? c.commentLikes.filter((like) => like.userId !== userId)
                    : [
                        ...c.commentLikes,
                        { userId, commentId: c.id, created_at: new Date() },
                      ],
                }
              : c
          )
        );
      }

      return { prevData };
    },
    onError: (_error, _variables, context) => {
      if (context?.prevData) {
        queryClient.setQueryData(
          commentKeys.allById(audioId),
          context.prevData
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: commentKeys.allById(audioId),
      });
    },
  });

  return { hasLiked, hasLikedByAuthor, isPending, toggleLikeMutation: mutate };
}
