"use server";

import { TCommentSchema } from "@/app/(main)/[username]/(detail)/[trackSlug]/comment-schema";
import { CommentFilterEnum } from "@/enums/comment-filter-enum";
import { getAxios } from "@/lib/axios";
import { TApiResponse } from "@/types/api-response.type";
import { TComment } from "@/types/comment.type";

export async function getComments(params: {
  audioId: string;
  filter: CommentFilterEnum;
}) {
  const { audioId, filter } = params;
  const axiosInstance = await getAxios();

  try {
    const response = await axiosInstance.get(
      `/api/audio/${audioId}/comments/`,
      {
        ...(filter && { params: { filter } }),
      }
    );
    return response.data as TApiResponse<{
      total: number;
      comments: TComment[];
    }>;
  } catch (error) {
    console.error("Failed to fetch comments:", error);
    throw new Error("Failed to get comments");
  }
}

export async function createComment(params: {
  audioId: string;
  commentSchema: TCommentSchema;
}) {
  const { audioId, commentSchema } = params;
  const axiosInstance = await getAxios();

  try {
    const response = await axiosInstance.post(
      `/api/audio/${audioId}/comments`,
      commentSchema
    );
    return response.data as TApiResponse;
  } catch (error) {
    console.error("Failed to create comment:", error);
    throw new Error("Failed to create comment");
  }
}

export async function deleteComment(params: {
  audioId: string;
  commentId: string;
}) {
  const { audioId, commentId } = params;
  const axiosInstance = await getAxios();

  try {
    const response = await axiosInstance.delete(
      `/api/audio/${audioId}/comments/${commentId}`
    );
    return response.data as TApiResponse;
  } catch (error) {
    console.error(
      `Failed to delete comment ${commentId} for audio ${audioId}:`,
      error
    );
    throw new Error(
      `Failed to delete comment with ID ${commentId} for audio ${audioId}`
    );
  }
}

export async function likeComment(params: {
  audioId: string;
  commentId: string;
}) {
  const { audioId, commentId } = params;
  const axiosInstance = await getAxios();

  try {
    const response = await axiosInstance.post(
      `/api/audio/${audioId}/comments/${commentId}/like`
    );
    return response.data as TApiResponse;
  } catch (error) {
    console.error("Failed to like comment:", error);
    throw new Error("Failed to like comment");
  }
}

export async function unlikeComment(params: {
  audioId: string;
  commentId: string;
}) {
  const { audioId, commentId } = params;
  const axiosInstance = await getAxios();

  try {
    const response = await axiosInstance.delete(
      `/api/audio/${audioId}/comments/${commentId}/unlike`
    );
    return response.data as TApiResponse;
  } catch (error) {
    console.error("Failed to unlike comment:", error);
    throw new Error("Failed to unlike comment");
  }
}
