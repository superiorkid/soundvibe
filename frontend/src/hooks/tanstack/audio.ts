import { audioKeys } from "@/lib/query-keys";
import { findAllAudio, findOneBySlug } from "@/server/audio";
import { useQuery } from "@tanstack/react-query";

export function useAudio() {
  const { data: audios, isPending } = useQuery({
    queryKey: audioKeys.all,
    queryFn: async () => findAllAudio(),
  });

  return { audios, isPending };
}

export function useAudioBySlug(slug: string) {
  const { data: audio, isPending } = useQuery({
    queryKey: audioKeys.detailBySlug(slug),
    queryFn: async () => findOneBySlug(slug),
    enabled: !!slug,
  });

  return { audio, isPending };
}
