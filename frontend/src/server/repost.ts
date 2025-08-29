"use server";

import { getAxios } from "@/lib/axios";
import { TApiResponse } from "@/types/api-response.type";

export async function repost(audioId: string) {
  const axiosInstance = await getAxios();

  try {
    const response = await axiosInstance.post(`/api/audio/${audioId}/reposts`);
    return response.data as TApiResponse;
  } catch (error) {
    console.error("failed to repost audio:", error);
    throw new Error("failed to repost audio");
  }
}

export async function undoRepost(audioId: string) {
  const axiosInstance = await getAxios();

  try {
    const response = await axiosInstance.delete(
      `/api/audio/${audioId}/reposts`
    );
    return response.data as TApiResponse;
  } catch (error) {
    console.error("failed to undo repost audio:", error);
    throw new Error("failed to undo  repost audio");
  }
}
