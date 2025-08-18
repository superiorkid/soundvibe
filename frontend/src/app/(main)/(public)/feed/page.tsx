import PageTitle from "@/components/page-title";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
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

const FeedPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <PageTitle className="2xl:text-2xl font-semibold text-xl tracking-tight">
          Hear the latest posts from the people you&apos;re following
        </PageTitle>
        <div className="flex gap-1 items-center">
          <Label className="text-base font-medium text-muted-foreground">
            Reposts
          </Label>
          <Switch />
        </div>
      </div>

      <div className="space-y-8">
        {dummyAudios.map((audio, index) => (
          <TrackCard key={index} audio={audio} />
        ))}
      </div>
    </div>
  );
};

export default FeedPage;
