"use server";

import {
  TCreatePlaylistSchema,
  TUpdatePlaylistSchema,
} from "@/app/(main)/create-playlist-schema";
import { PlaylistFilterEnum } from "@/enums/playlist-filter-enum";
import { getAxios } from "@/lib/axios";
import { TApiResponse } from "@/types/api-response.type";
import { TPlaylist } from "@/types/playlist-type";

export async function getCurrentUserPlaylist(params?: {
  query?: string;
  filter?: PlaylistFilterEnum;
}) {
  const axiosInstance = await getAxios();

  try {
    const response = await axiosInstance.get("/api/playlists/me", {
      params,
    });
    return response.data as TApiResponse<TPlaylist[]>;
  } catch (error) {
    console.error("Failed to fetch playlist", error);
    throw new Error("Failed to fetch playlist");
  }
}

export async function createPlaylist(
  createPlaylistSchema: TCreatePlaylistSchema
) {
  const axiosInstance = await getAxios();

  try {
    const response = await axiosInstance.post(
      "/api/playlists",
      createPlaylistSchema
    );
    return response.data as TApiResponse<TPlaylist>;
  } catch (error) {
    console.error("Failed to create playlist", error);
    throw new Error("Failed to create playlist");
  }
}

export async function addAudioToPlaylist(params: {
  audioId: string;
  playlistId: string;
}) {
  const { audioId, playlistId } = params;

  const axiosInstance = await getAxios();

  try {
    const response = await axiosInstance.post(
      `/api/playlists/${playlistId}/audio/${audioId}`
    );
    return response.data as TApiResponse;
  } catch (error) {
    console.error("Failed to add audio to playlist", error);
    throw new Error("Failed to add audio to playlist");
  }
}

export async function removeAudioFromPlaylist(params: {
  audioId: string;
  playlistId: string;
}) {
  const { audioId, playlistId } = params;

  const axiosInstance = await getAxios();

  try {
    const response = await axiosInstance.delete(
      `/api/playlists/${playlistId}/audio/${audioId}`
    );
    return response.data as TApiResponse;
  } catch (error) {
    console.error("Failed to remove audio from playlist", error);
    throw new Error("Failed to remove audio from playlist");
  }
}

export async function getPlaylistBySlug(slug: string) {
  const axiosInstance = await getAxios();

  try {
    const response = await axiosInstance.get(`/api/playlists/slug/${slug}`);
    return response.data as TApiResponse<TPlaylist>;
  } catch (error) {
    console.error("Failed to get detail playlist by slug", error);
    throw new Error("Failed to get detail playlist by slug");
  }
}

export async function likePlaylist(playlistId: string) {
  const axiosInstance = await getAxios();

  try {
    const response = await axiosInstance.post(
      `/api/playlists/${playlistId}/like`
    );
    return response.data as TApiResponse;
  } catch (error) {
    console.error("Failed to like playlist:", error);
    throw new Error("Could not like playlist. Please try again.");
  }
}

export async function unlikePlaylist(playlistId: string) {
  const axiosInstance = await getAxios();

  try {
    const response = await axiosInstance.delete(
      `/api/playlists/${playlistId}/unlike`
    );
    return response.data as TApiResponse;
  } catch (error) {
    console.error("Failed to like playlist:", error);
    throw new Error("Could not like playlist. Please try again.");
  }
}

export async function deletePlaylist(playlistId: string) {
  const axiosInstance = await getAxios();

  try {
    const response = await axiosInstance.delete(`/api/playlists/${playlistId}`);
    return response.data;
  } catch (error) {
    console.error("Failed to delete playlist:", error);
    throw new Error("Could not delete playlist. Please try again.");
  }
}

export async function updatePlaylist(params: {
  formData: FormData;
  playlistId: string;
}) {
  const { playlistId, formData } = params;
  const axiosInstance = await getAxios();
  try {
    const response = await axiosInstance.patch(
      `/api/playlists/${playlistId}`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return response.data;
  } catch (error) {
    console.error("Failed to update playlist:", error);
    throw new Error("Could not update playlsit. Please try again");
  }
}
