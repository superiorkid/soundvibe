"use server";

import { TCreatePlaylistSchema } from "@/app/(main)/create-playlist-schema";
import { getAxios } from "@/lib/axios";
import { TApiResponse } from "@/types/api-response.type";
import { TPlaylist } from "@/types/playlist-type";

export async function getCurrentUserPlaylist() {
  const axiosInstance = await getAxios();

  try {
    const response = await axiosInstance.get("/api/playlists/me");
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
