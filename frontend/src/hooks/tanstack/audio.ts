import { getQueryClient } from "@/lib/query-client";
import { audioKeys } from "@/lib/query-keys";
import { findAllAudio, findOneBySlug, uploadAudio } from "@/server/audio";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

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

export function useUploadAudio() {
  const router = useRouter();
  const queryClient = getQueryClient();

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
