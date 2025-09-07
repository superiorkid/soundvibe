"use client";

import { useUserByUsername } from "@/hooks/tanstack/user";
import { randomGradient } from "@/lib/random-gradient";
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
          src={user?.data?.image ?? "https://github.com/shadcn.png"}
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
            {user?.data?.name}
          </h1>
          <br />
          <p className="text-zinc-400 bg-foreground inline-block px-2 py-0.5">
            Al Henley AKA Thalbundt
          </p>
        </div>

        <p className="text-zinc-400 bg-foreground inline-block px-2 py-0.5">
          Manchester England, United Kingdom
        </p>
      </div>
    </div>
  );
};

export default UserSpecificHeader;
