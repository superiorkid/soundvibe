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

export async function uploadAudio(formData: FormData) {
  const axiosInstance = await getAxios();

  try {
    const response = await axiosInstance.post("/api/audio", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data as TApiResponse;
  } catch (error) {
    console.error("Failed to upload audio:", error);
    throw new Error("Failed to upload audio");
  }
}
