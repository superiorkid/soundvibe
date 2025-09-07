"use server";

import { getAxios } from "@/lib/axios";
import { TApiResponse } from "@/types/api-response.type";
import { TUser } from "@/types/user.type";

export async function getUserByUsername(username: string) {
  const axiosInstance = await getAxios();

  try {
    const response = await axiosInstance.get(`/api/users/username/${username}`);
    return response.data as TApiResponse<TUser>;
  } catch (error) {
    console.error("failed to get user by username:", error);
    throw new Error("failed to get user by username");
  }
}
