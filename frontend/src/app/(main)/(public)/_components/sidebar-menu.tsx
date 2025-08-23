"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button, buttonVariants } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { AudioLinesIcon, Loader2Icon, UserIcon } from "lucide-react";
import Link from "next/link";
import LikedTracksPanel from "./liked-tracks-panel";
import ListeningHistoryPanel from "./listening-history-panel";

const SidebarMenu = () => {
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return (
      <div className="p-4 flex justify-center">
        <Loader2Icon size={35} strokeWidth={2} className="animate-spin" />
      </div>
    );
  }

  if (!session) return null;

  return (
    <>
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <h1 className="font-semibold uppercase text-xs">
            artists you should follow
          </h1>
          <Button
            variant="ghost"
            size="sm"
            className="text-xs text-muted-foreground tracking-wide"
          >
            Refresh List
          </Button>
        </div>
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Avatar className="size-12">
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div className="text-sm">
                  <h2 className="font-semibold tracking-wide">Victorien</h2>
                  <div className="flex text-sx tracking-wide text-muted-foreground">
                    <Link
                      href="#"
                      className={cn(
                        buttonVariants({
                          size: "sm",
                          variant: "ghost",
                          className: cn("text-xs px-0"),
                        })
                      )}
                    >
                      <UserIcon size={14} strokeWidth={2} />
                      22.6K
                    </Link>
                    <Link
                      href="#"
                      className={cn(
                        buttonVariants({
                          size: "sm",
                          variant: "ghost",
                          className: cn("text-xs px-0"),
                        })
                      )}
                    >
                      <AudioLinesIcon size={14} strokeWidth={2} />
                      51
                    </Link>
                  </div>
                </div>
              </div>
              <div>
                <Button size="sm" className="rounded-sm">
                  Follow
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <LikedTracksPanel />
      <ListeningHistoryPanel />
    </>
  );
};

export default SidebarMenu;
