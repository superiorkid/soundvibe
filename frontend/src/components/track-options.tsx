"use client";

import CopyAudioLink from "@/app/(main)/_components/copy-audio-link";
import { authClient } from "@/lib/auth-client";
import {
  CopyIcon,
  EllipsisIcon,
  ListPlusIcon,
  ListStartIcon,
  Repeat2Icon,
  UploadIcon,
} from "lucide-react";
import { useState } from "react";
import { RepostAction } from "./repost-button";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { TAudio } from "@/types/audio.type";
import { cn } from "@/lib/utils";
import PlaylistOption from "@/app/(main)/_components/playlist-option";

interface TrackOptionsProps {
  audio: TAudio;
}

const TrackOptions = ({ audio }: TrackOptionsProps) => {
  const { data: session } = authClient.useSession();
  const [menuOpen, setMenuOpen] = useState<boolean>(false);

  return (
    <Dialog>
      <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
        <div data-menu-open={menuOpen}>
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

            <DropdownMenuItem asChild>
              <Button
                variant="ghost"
                className="hover:cursor-pointer w-full flex justify-start"
              >
                <UploadIcon strokeWidth={2} size={16} />
                Share
              </Button>
            </DropdownMenuItem>

            <DropdownMenuItem asChild>
              <CopyAudioLink
                url={`${process.env.NEXT_PUBLIC_FRONTEND_URL}/${audio.user.displayUsername}/${audio.slug}`}
                onSuccess={() => {
                  setMenuOpen(false);
                }}
              >
                {({ onClick }) => (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClick}
                    className="hover:cursor-pointer w-full flex justify-start"
                  >
                    <CopyIcon strokeWidth={2} size={16} />
                    Copy Link
                  </Button>
                )}
              </CopyAudioLink>
            </DropdownMenuItem>

            <DropdownMenuItem>
              <ListStartIcon size={16} strokeWidth={2} />
              Add To Next up
            </DropdownMenuItem>

            <DropdownMenuItem className="hover:cursor-pointer">
              <DialogTrigger className="hover:cursor-pointer flex items-center gap-1.5">
                <ListPlusIcon size={16} strokeWidth={2} />
                <span>Add to Playlist</span>
              </DialogTrigger>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </div>
      </DropdownMenu>

      <DialogContent
        className="top-[8%] left-[50%] translate-x-[-50%] translate-y-[-0%]
                   data-[state=open]:slide-in-from-top-90
                   data-[state=closed]:slide-out-to-top-90
                   duration-400 rounded-md min-w-[556px] p-4"
        onInteractOutside={(event) => event.preventDefault()}
      >
        <PlaylistOption audio={audio} />
      </DialogContent>
    </Dialog>
  );
};
export default TrackOptions;
