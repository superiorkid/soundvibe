import { getQueryClient } from "@/lib/query-client";
import { audioKeys } from "@/lib/query-keys";
import { repost, undoRepost } from "@/server/repost";
import { TAudio } from "@/types/audio.type";
import { useMutation } from "@tanstack/react-query";

const queryClient = getQueryClient();

export function useRepost(params: { audio: TAudio; userId: string }) {
  const { audio, userId } = params;

  const hasReposted = !!audio.reposts.some(
    (repost) => repost.userId === userId
  );

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      if (hasReposted) {
        return undoRepost(audio.id);
      }

      return repost(audio.id);
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
          repostsCount: hasReposted
            ? prevData.repostsCount - 1
            : prevData.repostsCount + 1,
          reposts: hasReposted
            ? prevData.reposts.filter((repost) => repost.userId !== userId)
            : [
                ...prevData.reposts,
                {
                  userId,
                  createdAt: new Date(),
                  audioId: audio.id,
                  id: Math.random()
                    .toString(36)
                    .substring(2, length + 2),
                },
              ],
        });
      }

      return { prevData };
    },
    onError: (_error, _variables, context) => {
      if (context?.prevData) {
        queryClient.setQueryData(
          audioKeys.detailById(audio.id),
          context.prevData
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: audioKeys.detailById(audio.id),
      });
      queryClient.invalidateQueries({
        queryKey: audioKeys.all,
      });
    },
  });

  return {
    hasReposted,
    isPending,
    toggleRepostMutation: mutate,
  };
}
