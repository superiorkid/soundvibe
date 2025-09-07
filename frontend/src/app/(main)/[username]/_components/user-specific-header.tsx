"use client";

import { useUserByUsername } from "@/hooks/tanstack/user";
import { randomGradient } from "@/lib/random-gradient";
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
      <div>
        <p>Loading...</p>
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
      className="h-[257px] flex gap-5 items-center py-3 px-7"
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

      <div>
        <h1>Kygo</h1>
        <p>admoaksmd</p>
      </div>
    </div>
  );
};

export default UserSpecificHeader;
