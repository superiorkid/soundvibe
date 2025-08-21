"use client";

import TrackCard from "@/app/(main)/_components/track-card";
import { useAudio } from "@/hooks/tanstack/audio";

const AudioList = () => {
  const { audios, isPending } = useAudio();

  if (isPending) {
    return (
      <div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {(audios?.data || []).map((audio, index) => (
        <TrackCard key={index} audio={audio} />
      ))}
    </div>
  );
};

export default AudioList;
