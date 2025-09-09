import { TCreatePlaylistSchema } from "@/app/(main)/create-playlist-schema";
import { PlaylistFilterEnum } from "@/enums/playlist-filter-enum";
import { getQueryClient } from "@/lib/query-client";
import { playlistKeys, userKeys } from "@/lib/query-keys";
import {
  addAudioToPlaylist,
  createPlaylist,
  deletePlaylist,
  getCurrentUserPlaylist,
  getPlaylistBySlug,
  likePlaylist,
  removeAudioFromPlaylist,
  unlikePlaylist,
  updatePlaylist,
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
        queryKey: playlistKeys.all,
      });
    },
  });

  return { audioToPlaylistToggle: mutate, isPending };
}

export function usePlaylistBySlug(slug: string) {
  const {
    data: playlist,
    isPending,
    isError,
  } = useQuery({
    queryKey: playlistKeys.detailBySlug(slug),
    queryFn: async () => getPlaylistBySlug(slug),
  });

  return { playlist, isPending, isError };
}

// export function useLikePlaylist(params: {
//   playlist: TPlaylist;
//   userId: string;
// }) {
//   const { playlist, userId } = params;
//   const hasLikedPlaylist = !!playlist.likes.some(
//     (like) => like.userId === userId
//   );

//   const { mutate, isPending } = useMutation({
//     mutationFn: async () => {
//       if (hasLikedPlaylist) return unlikePlaylist(playlist.id);
//       return likePlaylist(playlist.id);
//     },
//     onMutate: async () => {
//       await queryClient.cancelQueries({
//         queryKey: playlistKeys.detailBySlug(playlist.slug),
//       });

//       const prevData = queryClient.getQueryData<TPlaylist>(
//         playlistKeys.detailBySlug(playlist.slug)
//       );
//       if (prevData) {
//         queryClient.setQueryData<TPlaylist>(
//           playlistKeys.detailBySlug(playlist.slug),
//           {
//             ...prevData,
//             likeCount: hasLikedPlaylist
//               ? prevData.likeCount - 1
//               : prevData.likeCount + 1,
//             likes: hasLikedPlaylist
//               ? prevData.likes.filter((like) => like.userId !== userId)
//               : [
//                   ...prevData.likes,
//                   {
//                     userId,
//                     id: generateSecureRandomString(6),
//                     playlistId: playlist.id,
//                     createdAt: new Date(),
//                   },
//                 ],
//           }
//         );
//       }
//       return { prevData };
//     },
//     onError: (_error, _variables, context) => {
//       if (context?.prevData) {
//         queryClient.setQueryData(
//           playlistKeys.detailBySlug(playlist.slug),
//           context.prevData
//         );
//       }
//     },
//     onSettled: () => {
//       queryClient.invalidateQueries({
//         queryKey: playlistKeys.detailBySlug(playlist.slug),
//       });
//       queryClient.invalidateQueries({
//         queryKey: playlistKeys.all,
//       });
//     },
//   });

//   return {
//     hasLikedPlaylist,
//     likePlaylistToggle: mutate,
//     isPending,
//   };
// }

export function useLikePlaylist(params: {
  playlist: TPlaylist;
  userId: string;
}) {
  const { playlist, userId } = params;
  const hasLikedPlaylist = !!playlist.likes.some(
    (like) => like.userId === userId
  );
  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      if (hasLikedPlaylist) return unlikePlaylist(playlist.id);
      return likePlaylist(playlist.id);
    },
    onError: () => {
      toast.error(`Failed to ${hasLikedPlaylist ? "Unlike" : "Like"} playlist`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: playlistKeys.all });
      queryClient.invalidateQueries({ queryKey: userKeys.all });
    },
  });

  return {
    likePlaylistToggle: mutate,
    hasLikedPlaylist,
    isPending,
  };
}

export function useDeletePlaylist(props?: { onSuccess?: () => void }) {
  const { mutate, isPending } = useMutation({
    mutationFn: async (playlistId: string) => deletePlaylist(playlistId),
    onError: () => {
      toast.error("failed to delete playlist. try again.");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: playlistKeys.allCurrentUser(),
      });
      props?.onSuccess?.();
    },
  });

  return { deletePlaylistMutation: mutate, isPending };
}

export function useUpdatePlaylist(params: {
  playlistId: string;
  onSuccess?: () => void;
}) {
  const { playlistId, onSuccess } = params;
  const { mutate, isPending } = useMutation({
    mutationFn: async (formData: FormData) =>
      updatePlaylist({ formData, playlistId }),
    onError: () => {
      toast.error("Failed to update playlist. try again");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: playlistKeys.all });
      onSuccess?.();
    },
  });

  return { updatePlaylistMutation: mutate, isPending };
}
