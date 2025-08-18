import PageTitle from "@/components/page-title";
import { TTrack } from "@/types/track.type";
import TrackCard from "../../_components/track-card";

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
