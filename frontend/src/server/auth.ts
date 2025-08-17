import axiosInstance from "@/lib/http";
import { TSession } from "@/types/session.type";

export async function getSession(): Promise<TSession | null> {
  try {
    const response = await axiosInstance.get<TSession>("/auth/get-session", {
      fetchOptions: { cache: "no-store" },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch session:", error);
    return null;
  }
}
