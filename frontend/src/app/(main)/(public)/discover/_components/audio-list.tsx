"use client";

import TrackCard from "@/app/(main)/_components/track-card";
import { useAudio } from "@/hooks/tanstack/audio";
import { TTrack } from "@/types/track.type";

const dummyAudios = [
  {
    trackArtist: "Kygo",
    trackTitle: "Firestore",
    audioSrc: "/music/audio1.mp3",
  },
  {
    trackArtist: "K391",
    trackTitle: "Summertime",
    audioSrc: "/music/audio2.mp3",
  },
  {
    trackArtist: "Alan Walker",
    trackTitle: "Faded",
    audioSrc: "/music/audio3.mp3",
  },
] as TTrack[];

const AudioList = () => {
  const { audios, isPending } = useAudio();

  console.log("audio", audios);

  if (isPending) {
    return (
      <div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {dummyAudios.map((audio, index) => (
        <TrackCard key={index} audio={audio} />
      ))}
    </div>
  );
};

export default AudioList;
