"use server";

import { getAxios } from "@/lib/axios";
import { TApiResponse } from "@/types/api-response.type";
import { TAudio } from "@/types/audio.type";
import { TGenre } from "@/types/genre.type";
import { TPlaylist } from "@/types/playlist-type";

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

export async function findLatestTracksByGenre(params: {
  name: string;
  limit?: number;
}) {
  const { name, limit } = params;
  const axiosInstance = await getAxios();

  try {
    const response = await axiosInstance.get(
      `/api/v1/genres/name/${name}/latest`,
      { params: { limit } }
    );
    return response.data as TApiResponse<TAudio[]>;
  } catch (error) {
    console.error("Failed to fetch audio by genre:", error);
    throw new Error("Failed to fetch audio by genre");
  }
}

export async function findPopularTracksByGenre(params: {
  name: string;
  limit?: number;
}) {
  const { name, limit } = params;
  const axiosInstance = await getAxios();

  try {
    const response = await axiosInstance.get(
      `/api/v1/genres/name/${name}/popular`,
      { params: { limit } }
    );
    return response.data as TApiResponse<TAudio[]>;
  } catch (error) {
    console.error("Failed to fetch audio by genre:", error);
    throw new Error("Failed to fetch audio by genre");
  }
}

export async function findPlaylistsByGenre(params: {
  name: string;
  limit?: number;
}) {
  const { name, limit } = params;
  const axiosInstance = await getAxios();

  try {
    const response = await axiosInstance.get(
      `/api/v1/genres/name/${name}/playlists`,
      { params: { limit } }
    );
    return response.data as TApiResponse<TPlaylist[]>;
  } catch (error) {
    console.error("Failed to fetch playlists by genre:", error);
    throw new Error("Failed to fetch playlists by genre");
  }
}
