"use server";

import { getAxios } from "@/lib/axios";
import { TApiResponse } from "@/types/api-response.type";
import { TSearchEverything } from "@/types/search.type";

export const searchEverything = async (params: {
  keyword: string;
  limit?: number;
}) => {
  const axiosInstance = await getAxios();

  try {
    const response = await axiosInstance.get("/api/v1/search", { params });
    return response.data as TApiResponse<TSearchEverything[]>;
  } catch (error) {
    console.error("Failed to fetch audio:", error);
    throw new Error("Failed to get audios");
  }
};
