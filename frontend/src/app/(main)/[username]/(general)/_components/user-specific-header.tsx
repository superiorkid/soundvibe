"use client";

import { useUserByUsername } from "@/hooks/tanstack/user";
import { randomGradient } from "@/lib/random-gradient";
import { isAbsoluteUrl } from "@/lib/utils";
import { Loader2Icon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface UserSpecificHeaderProps {
  username: string;
}

const UserSpecificHeader = ({ username }: UserSpecificHeaderProps) => {
  const [bgGradient] = useState(randomGradient());

  const { isError, isPending, user } = useUserByUsername(username);

  if (isPending) {
    return (
      <div className="flex flex-col items-center justify-center h-[257px] gap-4">
        <Loader2Icon size={40} strokeWidth={2} className="animate-spin" />
        <span className="text-muted-foreground text-sm tracking-wide">
          Loading...
        </span>
      </div>
    );
  }

  if (isError) {
    return (
      <div>
        <p>Something went wrong</p>
      </div>
    );
  }

  return (
    <div
      className="h-[257px] flex gap-7 items-center py-3 px-12"
      style={{ background: bgGradient }}
    >
      <div className="relative size-44 rounded-full overflow-hidden">
        <Image
          fill
          src={
            user?.data?.image
              ? isAbsoluteUrl(user.data.image)
                ? user.data.image
                : `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users/cover/${user.data.id}`
              : "https://github.com/shadcn.png"
          }
          alt={`${user?.data?.name} image`}
          className="object-cover"
          loading="lazy"
          decoding="async"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>

      <div className="font-semibold space-y-2">
        <div>
          <h1 className="text-background py-0.5 hover:text-zinc-300 text-3xl bg-foreground inline-block px-2 capitalize hover:cursor-pointer">
            {user?.data?.displayUsername ??
              user?.data?.username ??
              "Unknown User"}
          </h1>
          <br />
          <p className="text-zinc-400 bg-foreground inline-block px-2 py-0.5">
            {user?.data?.firstName || user?.data?.lastName
              ? `${user?.data?.firstName ?? ""} ${
                  user?.data?.lastName ?? ""
                }`.trim()
              : "No name provided"}
          </p>
        </div>

        {(user?.data?.city || user?.data?.country) && (
          <p className="text-zinc-400 bg-foreground inline-block px-2 py-0.5 capitalize">
            {[user?.data?.city, user?.data?.country].filter(Boolean).join(", ")}
          </p>
        )}
      </div>
    </div>
  );
};

export default UserSpecificHeader;
