"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button, buttonVariants } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import {
  AudioLinesIcon,
  EllipsisIcon,
  HeartIcon,
  Loader2Icon,
  MessageSquareTextIcon,
  PlayIcon,
  Repeat2Icon,
  UserIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

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
    <aside className="space-y-8">
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

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <h1 className="font-semibold uppercase text-xs">498 likes</h1>
          <Link
            href="#"
            className={cn(
              buttonVariants({
                className: "text-xs text-muted-foreground tracking-wide",
                variant: "ghost",
                size: "sm",
              })
            )}
          >
            view all
          </Link>
        </div>
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="flex gap-3 group relative">
              <div className="size-14 relative">
                <Image
                  fill
                  src="https://images.unsplash.com/photo-1599601821513-00e3f9fa1e6a?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="imges"
                  loading="lazy"
                  decoding="async"
                  className="object-cover"
                />
              </div>
              <div className="flex-1 text-sm space-y-1.5">
                <div>
                  <h2 className="font-semibold tracking-wide text-muted-foreground">
                    Nicolas Haelg
                  </h2>
                  <p className="font-medium line-clamp-1">
                    Nicolas Haelg & Alfie Rhodes - Callin&lsquo; Your Name
                    (feat. Syren)
                  </p>
                </div>
                <div className="flex items-center space-x-2.5 text-muted-foreground">
                  <button className="flex items-center gap-0.5">
                    <PlayIcon
                      size={12}
                      className="fill-muted-foreground stroke-muted-foreground"
                    />
                    3.15M
                  </button>
                  <button className="flex items-center gap-0.5">
                    <HeartIcon
                      size={12}
                      className="fill-muted-foreground stroke-muted-foreground"
                    />
                    52K
                  </button>
                  <button className="flex items-center gap-0.5">
                    <Repeat2Icon size={14} strokeWidth={3} />
                    12.2K
                  </button>
                  <button className="flex items-center gap-0.5">
                    <MessageSquareTextIcon size={12} strokeWidth={3} />
                    502
                  </button>
                </div>
              </div>

              <div className="absolute right-0 top-1/2 -translate-y-1/2 flex gap-1 items-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <Button size="sm">
                  <HeartIcon size={14} />
                </Button>
                <Button size="sm">
                  <EllipsisIcon size={14} />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <h1 className="font-semibold uppercase text-xs">listening history</h1>
          <Link
            href="#"
            className={cn(
              buttonVariants({
                className: "text-xs text-muted-foreground tracking-wide",
                variant: "ghost",
                size: "sm",
              })
            )}
          >
            view all
          </Link>
        </div>
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="flex gap-3 group relative">
              <div className="size-14 relative">
                <Image
                  fill
                  src="https://images.unsplash.com/photo-1599601821513-00e3f9fa1e6a?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="imges"
                  loading="lazy"
                  decoding="async"
                  className="object-cover"
                />
              </div>
              <div className="flex-1 text-sm space-y-1.5">
                <div>
                  <h2 className="font-semibold tracking-wide text-muted-foreground">
                    Nicolas Haelg
                  </h2>
                  <p className="font-medium line-clamp-1">
                    Nicolas Haelg & Alfie Rhodes - Callin&lsquo; Your Name
                    (feat. Syren)
                  </p>
                </div>
                <div className="flex items-center space-x-2.5 text-muted-foreground">
                  <button className="flex items-center gap-0.5">
                    <PlayIcon
                      size={12}
                      className="fill-muted-foreground stroke-muted-foreground"
                    />
                    3.15M
                  </button>
                  <button className="flex items-center gap-0.5">
                    <HeartIcon
                      size={12}
                      className="fill-muted-foreground stroke-muted-foreground"
                    />
                    52K
                  </button>
                  <button className="flex items-center gap-0.5">
                    <Repeat2Icon size={14} strokeWidth={3} />
                    12.2K
                  </button>
                  <button className="flex items-center gap-0.5">
                    <MessageSquareTextIcon size={12} strokeWidth={3} />
                    502
                  </button>
                </div>
              </div>

              <div className="absolute right-0 top-1/2 -translate-y-1/2 flex gap-1 items-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <Button size="sm">
                  <HeartIcon size={14} />
                </Button>
                <Button size="sm">
                  <EllipsisIcon size={14} />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default SidebarMenu;
