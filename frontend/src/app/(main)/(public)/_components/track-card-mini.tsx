import UserTooltip from "@/components/user-tooltip";
import { TAudio } from "@/types/audio.type";
import { TUser } from "@/types/user.type";
import {
  HeartIcon,
  MessageSquareTextIcon,
  PlayIcon,
  Repeat2Icon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import TrackActionsMini from "./track-actions-mini";

interface TrackCardMiniProps {
  audio: TAudio;
}

const TrackCardMini = ({ audio }: TrackCardMiniProps) => {
  return (
    <div className="flex gap-3 group relative">
      <div className="size-14 relative shrink-0">
        {audio?.coverFile ? (
          <Image
            fill
            src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/audio/cover/${audio.id}`}
            alt={`${audio.title} image`}
            className="object-cover rounded-md"
            loading="lazy"
            decoding="async"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-amber-600/70 to-yellow-400/70 flex items-center justify-center rounded-md">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="opacity-80"
            >
              <path d="M9 18V5l12-2v13" />
              <circle cx="6" cy="18" r="3" />
              <circle cx="18" cy="16" r="3" />
            </svg>
          </div>
        )}
      </div>

      <div className="flex-1 text-sm space-y-1.5">
        <div>
          <UserTooltip user={audio?.user as TUser}>
            <h2 className="font-semibold tracking-wide text-muted-foreground hover:cursor-pointer hover:opacity-50 capitalize">
              {audio?.artist}
            </h2>
          </UserTooltip>
          <p className="font-medium line-clamp-1 capitalize hover:cursor-pointer hover:opacity-50">
            <Link href={`/${audio.user.displayUsername}/${audio.slug}`}>
              {audio?.title}
            </Link>
          </p>
        </div>
        <div className="flex items-center space-x-2.5 text-muted-foreground">
          {audio?.playsCount > 0 && (
            <button className="flex items-center gap-0.5">
              <PlayIcon
                size={12}
                className="fill-muted-foreground stroke-muted-foreground mr-0.5"
              />
              {audio.playsCount}
            </button>
          )}

          <Link
            href={`/${audio.user.displayUsername}/${audio.slug}/likes`}
            className="flex items-center gap-0.5 hover:cursor-pointer hover:opacity-50"
          >
            <HeartIcon
              size={12}
              className="fill-muted-foreground stroke-muted-foreground mr-0.5"
            />
            {audio?.likesCount > 0 && audio.likesCount}
          </Link>
          <button className="flex items-center gap-0.5">
            <Repeat2Icon size={14} strokeWidth={3} />
            {audio.repostsCount > 0 && audio.repostsCount}
          </button>
          <button className="flex items-center gap-0.5">
            <MessageSquareTextIcon size={12} strokeWidth={3} />
            {audio.commentsCount > 0 && audio.commentsCount}
          </button>
        </div>
      </div>

      <TrackActionsMini audio={audio} />
    </div>
  );
};

export default TrackCardMini;
