"use server";

import { getAxios } from "@/lib/axios";
import { TApiResponse } from "@/types/api-response.type";
import { TFollow } from "@/types/follows.type";
import { TUser } from "@/types/user.type";

export async function follow(userId: string) {
  const axiosInstance = await getAxios();

  try {
    const response = await axiosInstance.post(`/api/v1/follows/${userId}`);
    return response.data as TApiResponse;
  } catch (error) {
    console.error("Failed to follow user:", error);
    throw new Error("Failed to follow user");
  }
}

export async function unfollow(userId: string) {
  const axiosInstance = await getAxios();

  try {
    const response = await axiosInstance.delete(`/api/v1/follows/${userId}`);
    return response.data as TApiResponse;
  } catch (error) {
    console.error("Failed to unfollow user:", error);
    throw new Error("Failed to unfollow user");
  }
}

export async function getFollowers(userId: string) {
  const axiosInstance = await getAxios();

  try {
    const response = await axiosInstance.get(
      `/api/v1/follows/${userId}/followers`
    );
    return response.data as TApiResponse<TFollow[]>;
  } catch (error) {
    console.error("Failed to get followers:", error);
    throw new Error("Failed to get followers");
  }
}

export async function getFollowing(userId: string) {
  const axiosInstance = await getAxios();

  try {
    const response = await axiosInstance.get(
      `/api/v1/follows/${userId}/following`
    );
    return response.data as TApiResponse<TFollow[]>;
  } catch (error) {
    console.error("Failed to get following:", error);
    throw new Error("Failed to get following");
  }
}

export async function getSuggestedUsers(limit: number) {
  const axiosInstance = await getAxios();

  try {
    const response = await axiosInstance.get("/api/v1/follows/suggested", {
      params: { limit },
    });
    return response.data as TApiResponse<TUser[]>;
  } catch (error) {
    console.error("Failed to get suggested users:", error);
    throw new Error("Failed to get suggested users");
  }
}
