"use server";

import { getAxios } from "@/lib/axios";
import { TApiResponse } from "@/types/api-response.type";
import { TAudio } from "@/types/audio.type";

export async function findAllAudio() {
  const axiosInstance = await getAxios();

  try {
    const response = await axiosInstance.get("/api/audio");
    return response.data as TApiResponse<TAudio[]>;
  } catch (error) {
    console.error("Failed to fetch audio:", error);
    throw new Error("Failed to get audios");
  }
}

export async function findOneBySlug(slug: string) {
  const axiosInstance = await getAxios();

  try {
    const response = await axiosInstance.get(`/api/audio/slug/${slug}`);
    return response.data as TApiResponse<TAudio>;
  } catch (error) {
    console.error("Failed to fetch audio detail:", error);
    throw new Error("Failed to get audio detail");
  }
}
