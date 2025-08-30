import { getQueryClient } from "@/lib/query-client";
import { listeningHistoryKeys } from "@/lib/query-keys";
import {
  clearListeningHistory,
  getListehingHistory,
  setListeningHistory,
} from "@/server/listening-history";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

const queryClient = getQueryClient();

export function useListeningHistory(params: {
  take: number;
  userId: string;
  query?: string;
}) {
  const { isPending, data, isError } = useQuery({
    queryKey: listeningHistoryKeys.audioWithLimit(params),
    queryFn: async () => getListehingHistory(params),
  });

  return { isPending, data, isError };
}

export function useSetListeningHistory() {
  const { mutate, isPending } = useMutation({
    mutationFn: async (audioId: string) => setListeningHistory(audioId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: listeningHistoryKeys.all,
      });
    },
    onError: () => {
      console.error("Failed to create listening history");
    },
  });

  return { setListeningHistoryMutation: mutate, isPending };
}

export function useClearListeningHistory({
  onSuccess,
}: {
  onSuccess?: () => void;
}) {
  const { mutate, isPending } = useMutation({
    mutationFn: async () => clearListeningHistory(),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: listeningHistoryKeys.all,
      });
      onSuccess?.();
    },
    onError: (error) => {
      toast.error("Failed to clear listening history", {
        description:
          error.message ||
          "Failed to clear listening history. Please try again.",
      });
    },
  });

  return { clearListeningHistoryMutation: mutate, isPending };
}
