"use server";

import { getAxios } from "@/lib/axios";
import { TApiResponse } from "@/types/api-response.type";
import { TListeningHistory } from "@/types/listening-history.type";

export async function getListehingHistory(params: {
  take: number;
  userId: string;
  query?: string;
}) {
  const { take, userId, query } = params;
  const axiosInstance = await getAxios();

  try {
    const response = await axiosInstance.get(
      `/api/users/${userId}/listening-history`,
      {
        params: { take, query },
      }
    );
    return response.data as TApiResponse<TListeningHistory[]>;
  } catch (error) {
    console.error("Failed to listehing history:", JSON.stringify(error));
    throw new Error("Failed to get listehing history");
  }
}

export async function setListeningHistory(audioId: string) {
  const axiosInstance = await getAxios();

  try {
    const response = await axiosInstance.post(
      `/api/listening-history/${audioId}`
    );
    return response.data as TApiResponse;
  } catch (error) {
    console.error("Failed to create listening history:", error);
    throw new Error("Failed to create listening history");
  }
}

export async function clearListeningHistory() {
  const axiosInstance = await getAxios();
  try {
    const response = await axiosInstance.delete(`/api/users/listening-history`);
    return response.data as TApiResponse;
  } catch (error) {
    console.error("Failed to clear listening history:", error);
    throw new Error("Failed to clear listening history");
  }
}
