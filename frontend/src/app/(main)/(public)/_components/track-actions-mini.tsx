"use client";

import { RepostAction } from "@/components/repost-button";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLike } from "@/hooks/tanstack/audio";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { TAudio } from "@/types/audio.type";
import {
  CheckIcon,
  CopyIcon,
  EllipsisIcon,
  HeartIcon,
  Repeat2Icon,
} from "lucide-react";
import { useState } from "react";
import CopyAudioLink from "../../_components/copy-audio-link";

interface TrackActionsMiniProps {
  audio: TAudio;
}

const TrackActionsMini = ({ audio }: TrackActionsMiniProps) => {
  const { data: session } = authClient.useSession();
  const { hasLiked, toggleLikeMutation } = useLike(
    audio,
    session?.user.id as string
  );

  const [menuOpen, setMenuOpen] = useState<boolean>(false);

  return (
    <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
      <div
        className={cn(
          "absolute right-0 top-1/2 -translate-y-1/2 flex gap-1 items-center transition-opacity duration-200",
          menuOpen ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        )}
      >
        <Button
          size="sm"
          variant="secondary"
          className="hover:cursor-pointer"
          onClick={() => toggleLikeMutation()}
        >
          <HeartIcon
            size={14}
            className={cn(
              "fill-foreground stroke-foreground",
              hasLiked && "fill-red-500 stroke-red-500"
            )}
          />
        </Button>

        <DropdownMenuTrigger asChild>
          <Button
            size="sm"
            variant="secondary"
            className="hover:cursor-pointer"
          >
            <EllipsisIcon
              size={14}
              strokeWidth={2}
              className="fill-foreground stroke-foreground"
            />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <RepostAction
              audio={audio}
              userId={session?.user.id as string}
              onSuccess={() => {
                setMenuOpen(false);
              }}
            >
              {({ hasReposted, isPending, toggleRepost }) => (
                <Button
                  variant="ghost"
                  onClick={toggleRepost}
                  disabled={isPending}
                  className="flex justify-start hover:opacity-50 w-full hover:cursor-pointer"
                >
                  <Repeat2Icon
                    strokeWidth={2}
                    size={16}
                    className={cn(hasReposted && "stroke-rose-500")}
                  />
                  <span className={cn(hasReposted && "text-rose-500")}>
                    {hasReposted ? "Reposted" : "Repost"}
                  </span>
                </Button>
              )}
            </RepostAction>
          </DropdownMenuItem>

          <DropdownMenuItem>Share</DropdownMenuItem>
          <DropdownMenuItem asChild>
            <CopyAudioLink
              url={audio.streamUrl ?? ""}
              onSuccess={() => {
                setMenuOpen(false);
              }}
            >
              {({ onClick, copied }) => (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClick}
                  className="hover:cursor-pointer w-full"
                >
                  {copied ? (
                    <CheckIcon strokeWidth={2} size={16} />
                  ) : (
                    <>
                      <CopyIcon strokeWidth={2} size={16} />
                      Copy Link
                    </>
                  )}
                </Button>
              )}
            </CopyAudioLink>
          </DropdownMenuItem>
          <DropdownMenuItem>Add To Next up</DropdownMenuItem>
          <DropdownMenuItem>Add To Playlist</DropdownMenuItem>
        </DropdownMenuContent>
      </div>
    </DropdownMenu>
  );
};

export default TrackActionsMini;
