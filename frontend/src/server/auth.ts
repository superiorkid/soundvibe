"use server";

import { getAxios } from "@/lib/axios";
import { TSession } from "@/types/session.type";

export async function getSession(): Promise<TSession | null> {
  const axiosInstance = await getAxios();

  try {
    const response = await axiosInstance.get<TSession>("/auth/get-session");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch session:", error);
    return null;
  }
}
