"use client";

import { useAudioBySlug } from "@/hooks/tanstack/audio";
import Image from "next/image";
import Link from "next/link";
import { H3 } from "shadcn-typography";

interface TrackHeaderMiniProps {
  trackSlug: string;
}

const TrackHeaderMini = ({ trackSlug }: TrackHeaderMiniProps) => {
  const { audio, isPending } = useAudioBySlug(trackSlug);

  if (isPending) {
    return (
      <div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex gap-6 items-center">
      <div className="relative size-30 overflow-hidden">
        {audio?.data?.coverFile ? (
          <Image
            fill
            src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/audio/cover/${audio.data.id}`}
            alt="track image"
            loading="lazy"
            decoding="async"
            className="object-cover rounded-lg"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-amber-600/70 to-yellow-400/70 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
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
      <H3 className="flex-1 border-none hover:opacity-50 capitalize tracking-wide line-clamp-2">
        <Link
          href={`/${audio?.data?.user.displayUsername}/${audio?.data?.slug}`}
        >
          {audio?.data?.title}
        </Link>
      </H3>
    </div>
  );
};

export default TrackHeaderMini;
