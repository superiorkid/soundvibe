import { useRepost } from "@/hooks/tanstack/repost";
import { TAudio } from "@/types/audio.type";

interface RepostProps {
  audio: TAudio;
  userId: string;
  onSuccess?: () => void;
  children: (props: {
    hasReposted: boolean;
    isPending: boolean;
    toggleRepost: () => void;
  }) => React.ReactNode;
}

export const RepostAction = ({
  audio,
  userId,
  onSuccess,
  children,
}: RepostProps) => {
  const { hasReposted, isPending, toggleRepostMutation } = useRepost({
    audio,
    userId,
    onSuccess,
  });

  return children({
    hasReposted,
    isPending,
    toggleRepost: toggleRepostMutation,
  });
};
