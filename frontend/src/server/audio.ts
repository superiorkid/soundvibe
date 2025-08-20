"use server";

import { getAxios } from "@/lib/axios";

export async function findAllAudio() {
  const axiosInstance = await getAxios();

  try {
    const response = await axiosInstance.get("/api/audio");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch audio:", error);
    return [];
  }
}
