import PageTitle from "@/components/page-title";
import TrackCard from "../../_components/track-card";
import { TTrack } from "@/types/track.type";

const dummyAudios = [
  {
    trackArtist: "Kygo",
    trackTitle: "Firestore",
    audioSrc: "/music/Kim - digital death [NCS Release].mp3",
  },
  {
    trackArtist: "K391",
    trackTitle: "Summertime",
    audioSrc: "/music/Nito-Onna, Mangoo - Reason [NCS Release].mp3",
  },
  {
    trackArtist: "Alan Walker",
    trackTitle: "Faded",
    audioSrc:
      "/music/Rival, Alan Walker - Dreamer (Rival Remix) [NCS Release].mp3",
  },
] as TTrack[];

const DiscoverPage = () => {
  return (
    <div className="space-y-6">
      <PageTitle className="2xl:text-2xl font-semibold text-xl">
        Discover Tracks and Playlist
      </PageTitle>

      <div className="space-y-8">
        {dummyAudios.map((audio, index) => (
          <TrackCard key={index} audio={audio} />
        ))}
      </div>
    </div>
  );
};

export default DiscoverPage;
