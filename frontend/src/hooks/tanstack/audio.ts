import { getQueryClient } from "@/lib/query-client";
import { audioKeys, playlistKeys, userKeys } from "@/lib/query-keys";
import {
  findAllAudio,
  findOneBySlug,
  getTopFans,
  getTrackPlaylists,
  getTrackReposted,
  getUsersWhoLikedAudio,
  likeAudio,
  playIncrement,
  recentLike,
  unlikeAudio,
  uploadAudio,
} from "@/server/audio";
import { TAudio, TRecentLike } from "@/types/audio.type";
import { TLike } from "@/types/like.type";
import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const queryClient = getQueryClient();

export function useInfiniteAudios(params: {
  showRepost: boolean;
  limit?: number;
}) {
  const { showRepost, limit = 6 } = params;
  return useInfiniteQuery({
    queryKey: audioKeys.audioWithRepost({ showRepost, limit }),
    queryFn: async ({ pageParam = 1 }) =>
      findAllAudio({ showRepost, page: pageParam, limit }),
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage?.data || lastPage.data.length < limit) return undefined;
      return allPages.length + 1;
    },
    initialPageParam: 1,
  });
}

export function useAudios(params: {
  showRepost: boolean;
  page?: number;
  limit?: number;
}) {
  const { data: audios, isPending } = useQuery({
    queryKey: audioKeys.audioWithRepost(params),
    queryFn: async () => findAllAudio(params),
  });

  return { audios, isPending };
}

export function useAudioBySlug(slug: string) {
  const {
    data: audio,
    isPending,
    error,
    isError,
  } = useQuery({
    queryKey: audioKeys.detailBySlug(slug),
    queryFn: async () => findOneBySlug(slug),
    enabled: !!slug,
  });

  return { audio, isPending, error, isError };
}

export function useUploadAudio() {
  const router = useRouter();

  const { mutate, isPending } = useMutation({
    mutationFn: async (formData: FormData) => uploadAudio(formData),
    onSuccess: () => {
      toast.success("Upload Successful", {
        description: "Your audio has been uploaded successfully.",
      });
      queryClient.invalidateQueries({ queryKey: audioKeys.all });
      router.replace("/feed");
    },
    onError: (error) => {
      toast.error("Upload Failed", {
        description:
          error.message || "There was an issue uploading your audio.",
      });
    },
  });

  return { uploadAudioMutation: mutate, isPending };
}

export function useLike(audio: TAudio, userId: string) {
  const hasLiked = !!audio?.likes?.some((like) => like.userId === userId);
  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      if (hasLiked) {
        return unlikeAudio(audio.id);
      }
      return likeAudio(audio.id);
    },
    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: audioKeys.detailById(audio.id),
      });

      const prevData = queryClient.getQueryData<TAudio>(
        audioKeys.detailById(audio.id)
      );
      if (prevData) {
        queryClient.setQueryData<TAudio>(audioKeys.detailById(audio.id), {
          ...prevData,
          likesCount: hasLiked
            ? prevData.likesCount - 1
            : prevData.likesCount + 1,
          likes: hasLiked
            ? prevData.likes.filter((like) => like.userId !== userId)
            : [
                ...prevData.likes,
                { userId, audioId: audio.id, created_at: new Date() },
              ],
        });
      }

      return { prevData };
    },
    // rollback on error
    onError: (_error, _variables, context) => {
      if (context?.prevData) {
        queryClient.setQueryData(
          audioKeys.detailById(audio.id),
          context.prevData
        );
      }
    },
    // referch after success/failure
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: audioKeys.detailById(audio.id),
      });
      queryClient.invalidateQueries({
        queryKey: audioKeys.all,
      });
      queryClient.invalidateQueries({
        queryKey: playlistKeys.all,
      });
      queryClient.invalidateQueries({ queryKey: userKeys.all });
    },
  });

  return { hasLiked, isPending, toggleLikeMutation: mutate };
}

// export function useLike(audio: TAudio, userId: string) {
//   const hasLiked = !!audio?.likes?.some((like) => like.userId === userId);

//   const { mutate, isPending } = useMutation({
//     mutationFn: async () => {
//       if (hasLiked) {
//         return unlikeAudio(audio.id);
//       }
//       return likeAudio(audio.id);
//     },
//     onError: () => {
//       toast.error(`Failed to ${hasLiked ? "Unlike" : "Like"} audio.`);
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: audioKeys.all });
//       queryClient.invalidateQueries({ queryKey: playlistKeys.all });
//     },
//   });

//   return { hasLiked, isPending, toggleLikeMutation: mutate };
// }

export function useRecentLiked<
  T extends TLike[] | TRecentLike[] = TLike[]
>(params: {
  limit: number;
  query?: string;
  username?: string;
  withPlaylist?: boolean;
}) {
  const { data: likedTracks, isPending } = useQuery({
    queryKey: audioKeys.recentLiked(params),
    queryFn: async () => recentLike<T>(params),
  });

  return { likedTracks, isPending };
}

export function useIncrementPlay() {
  const { mutate, isPending } = useMutation({
    mutationFn: async (audioId: string) => playIncrement(audioId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: audioKeys.all });
    },
    onError: (error: unknown) => {
      console.error("Error incrementing play count:", error);
    },
  });

  return {
    incrementPlayMutation: mutate,
    isPending,
  };
}

export function useUsersWhoLikedAudio(params: { slug: string; limit: number }) {
  const { data: usersWhoLiked, isPending } = useQuery({
    queryKey: audioKeys.usersLikesAudio(params),
    queryFn: async () => getUsersWhoLikedAudio(params),
    enabled: !!params.slug,
  });

  return { usersWhoLiked, isPending };
}

export function useTopFans(params: { audioId: string; days: number }) {
  const { data: topFans, isPending } = useQuery({
    queryKey: audioKeys.topFans(params.audioId, params.days),
    queryFn: async () => getTopFans(params),
    enabled: !!params.audioId,
  });

  return { topFans, isPending };
}

export function useTrackPlaylists(params: { audioId: string; limit?: number }) {
  const {
    data: playlists,
    isPending,
    isError,
    refetch,
  } = useQuery({
    queryKey: audioKeys.trackPlaylists(params),
    queryFn: async () => getTrackPlaylists(params),
    enabled: !!params.audioId,
  });

  return { playlists, isPending, isError, refetch };
}

export function useTrackReposted(params: { audioId: string; limit?: number }) {
  const {
    data: reposts,
    isPending,
    isError,
    refetch,
  } = useQuery({
    queryKey: audioKeys.trackReposted(params),
    queryFn: async () => getTrackReposted(params),
    enabled: !!params.audioId,
  });

  return { reposts, isPending, isError, refetch };
}
