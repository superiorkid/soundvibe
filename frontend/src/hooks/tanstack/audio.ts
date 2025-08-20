import { findAllAudio } from "@/server/audio";
import { useQuery } from "@tanstack/react-query";

export function useAudio() {
  const { data: audios, isPending } = useQuery({
    queryKey: ["audio"],
    queryFn: async () => findAllAudio(),
  });

  return { audios, isPending };
}
