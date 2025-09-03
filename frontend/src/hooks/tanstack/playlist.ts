import { TCreatePlaylistSchema } from "@/app/(main)/create-playlist-schema";
import { PlaylistFilterEnum } from "@/enums/playlist-filter-enum";
import { getQueryClient } from "@/lib/query-client";
import { playlistKeys } from "@/lib/query-keys";
import {
  addAudioToPlaylist,
  createPlaylist,
  getCurrentUserPlaylist,
  removeAudioFromPlaylist,
} from "@/server/playlist";
import { TPlaylist } from "@/types/playlist-type";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

const queryClient = getQueryClient();

export function useCurrentUserPlaylist(params?: {
  query?: string;
  filter?: PlaylistFilterEnum;
}) {
  const {
    data: playlists,
    isPending,
    isError,
  } = useQuery({
    queryKey: playlistKeys.allCurrentUser(params),
    queryFn: async () => getCurrentUserPlaylist(params),
  });

  const checkIfAudioExists = (playlistId: string, audioId: string) => {
    const playlist = (playlists?.data || []).find((p) => p.id === playlistId);
    return playlist?.audios?.some((a) => a.audioId === audioId);
  };

  return { playlists, isPending, isError, checkIfAudioExists };
}

interface Props {
  onSuccess?: () => void;
}
export function useCreatePlaylist(props?: Props) {
  const { mutate, isPending, data } = useMutation({
    mutationFn: (playlistSchema: TCreatePlaylistSchema) =>
      createPlaylist(playlistSchema),
    onError: () => toast.error("Failed to create playlist. Please try again."),
    onSuccess: () => {
      toast.success("create playlist successfully", { description: "" });
      queryClient.invalidateQueries({
        queryKey: playlistKeys.allCurrentUser(),
      });
      props?.onSuccess?.();
    },
  });

  return { createPlaylistMutation: mutate, isPending, data };
}

export function useAddAudioPlaylist(params: {
  playlist: TPlaylist;
  audioId: string;
}) {
  const { playlist, audioId } = params;
  const hasAddedToPlaylist = !!playlist.audios.some(
    (list) => list.audioId === audioId
  );
  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      if (hasAddedToPlaylist) {
        return removeAudioFromPlaylist({ audioId, playlistId: playlist.id });
      }
      return addAudioToPlaylist({ audioId, playlistId: playlist.id });
    },
    onError: () => {
      toast.error("Failed to update playlist", {
        description: "Something went wrong while adding/removing the track.",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: playlistKeys.allCurrentUser(),
      });
    },
  });

  return { audioToPlaylistToggle: mutate, isPending };
}
