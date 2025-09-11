"use server";

import { getAxios } from "@/lib/axios";
import { TApiResponse } from "@/types/api-response.type";
import { TAudio, TRecentLike } from "@/types/audio.type";
import { TLike } from "@/types/like.type";
import { TUser } from "@/types/user.type";

export async function findAllAudio(params: { showRepost: boolean }) {
  const { showRepost } = params;
  const axiosInstance = await getAxios();

  try {
    const response = await axiosInstance.get("/api/v1/audio", {
      params: { showRepost },
    });
    return response.data as TApiResponse<
      {
        id: string;
        type: "audio" | "repost";
        createdAt: Date;
        user: TUser;
        audio: TAudio;
      }[]
    >;
  } catch (error) {
    console.error("Failed to fetch audios:", error);
    throw new Error("Failed to get audios");
  }
}

export async function findOneBySlug(slug: string) {
  const axiosInstance = await getAxios();

  try {
    const response = await axiosInstance.get(`/api/v1/audio/slug/${slug}`);
    return response.data as TApiResponse<TAudio>;
  } catch (error) {
    console.error("Failed to fetch audio detail:", error);
    throw new Error("Failed to get audio detail");
  }
}

export async function uploadAudio(formData: FormData) {
  const axiosInstance = await getAxios();

  try {
    const response = await axiosInstance.post("/api/v1/audio", formData, {
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

export async function likeAudio(audioId: string) {
  const axiosInstance = await getAxios();

  try {
    const response = await axiosInstance.post(`/api/v1/audio/${audioId}/like`);
    return response.data as TApiResponse;
  } catch (error) {
    console.error("Failed to like audio track:", error);
    throw new Error("Could not like the audio track. Please try again.");
  }
}

export async function unlikeAudio(audioId: string) {
  const axiosInstance = await getAxios();

  try {
    const response = await axiosInstance.delete(
      `/api/v1/audio/${audioId}/unlike`
    );
    return response.data as TApiResponse;
  } catch (error) {
    console.error("Failed to unlike audio track:", error);
    throw new Error("Could not unlike the audio track. Please try again.");
  }
}

export async function recentLike<
  T extends TLike[] | TRecentLike[] = TLike[]
>(params: {
  limit: number;
  query?: string;
  username?: string;
  withPlaylist?: boolean;
}): Promise<TApiResponse<{ total: number; recent: T }>> {
  const { limit, query, username, withPlaylist = false } = params;
  const axiosInstance = await getAxios();

  try {
    const response = await axiosInstance.get("/api/v1/audio/liked/recent", {
      params: { limit, query, username, withPlaylist },
    });

    return response.data as TApiResponse<{ total: number; recent: T }>;
  } catch (error) {
    console.error("Failed to fetch recent liked tracks:", error);
    throw new Error(
      "Unable to retrieve your recent liked tracks right now. Please check your connection or try again later."
    );
  }
}

export async function playIncrement(audioId: string) {
  const axiosInstance = await getAxios();

  try {
    const response = await axiosInstance.post(`/api/v1/audio/${audioId}/play`);
    return response.data as TApiResponse;
  } catch (error) {
    console.error("Failed to increment play count:", error);
    throw new Error("Could not increment play count. Please try again.");
  }
}

export async function getUsersWhoLikedAudio(params: {
  slug: string;
  limit: number;
}) {
  const { slug, limit } = params;
  const axiosInstance = await getAxios();

  try {
    const response = await axiosInstance.get(
      `/api/v1/audio/${slug}/like/users`,
      {
        params: { limit },
      }
    );
    return response.data as TApiResponse<{ total: number; result: TLike[] }>;
  } catch (error) {
    console.error("Failed to increment play count:", error);
    throw new Error("Could not increment play count. Please try again.");
  }
}

export async function getTopFans(params: { days: number; audioId: string }) {
  const { audioId, days } = params;
  const axiosInstance = await getAxios();

  try {
    const response = await axiosInstance.get(`/api/v1/audio/${audioId}/fans`, {
      params: days !== 0 ? { days } : {},
    });
    return response.data as TApiResponse<{ user: TUser; plays: number }[]>;
  } catch (error) {
    console.error("Failed to increment play count:", error);
    throw new Error("Could not increment play count. Please try again.");
  }
}
