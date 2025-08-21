import { audioKeys } from "@/lib/query-keys";
import { findAllAudio } from "@/server/audio";
import { useQuery } from "@tanstack/react-query";

export function useAudio() {
  const { data: audios, isPending } = useQuery({
    queryKey: audioKeys.all,
    queryFn: async () => findAllAudio(),
  });

  return { audios, isPending };
}
