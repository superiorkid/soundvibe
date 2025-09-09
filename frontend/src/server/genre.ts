"use server";

import { getAxios } from "@/lib/axios";
import { TApiResponse } from "@/types/api-response.type";
import { TGenre } from "@/types/genre.type";

export async function findAllGenre() {
  const axiosInstance = await getAxios();

  try {
    const response = await axiosInstance.get("/api/v1/genres");
    return response.data as TApiResponse<TGenre[]>;
  } catch (error) {
    console.error("Failed to fetch audio:", error);
    throw new Error("Failed to get audios");
  }
}
