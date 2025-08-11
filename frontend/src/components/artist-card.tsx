"use client";

import { UserIcon } from "lucide-react";
import Image from "next/image";
import { ReactNode } from "react";

export const ArtistCard = ({ children }: { children: ReactNode }) => {
  return <div className="flex gap-4 items-center">{children}</div>;
};

export const ArtistCardImage = ({ src, alt }: { src: string; alt: string }) => {
  return (
    <div className="relative size-38 overflow-hidden">
      <Image
        fill
        src={src}
        className="object-cover rounded-full"
        alt={alt}
        decoding="async"
        loading="lazy"
      />
    </div>
  );
};

export const ArtistCardInfo = ({
  name,
  location,
  followers,
}: {
  name: string;
  location: string;
  followers: string;
}) => {
  return (
    <div className="text-sm space-y-1">
      <h2 className="font-semibold">{name}</h2>
      <h5 className="font-semibold text-muted-foreground">{location}</h5>
      <p className="text-xs font-medium tracking-wide">
        <UserIcon size={16} className="mr-1 inline-flex" />
        {followers} followers
      </p>
    </div>
  );
};

export const ArtistCardActions = ({ children }: { children: ReactNode }) => {
  return <div className="flex items-center">{children}</div>;
};
