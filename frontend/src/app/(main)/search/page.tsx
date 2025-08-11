import {
  ArtistCard,
  ArtistCardActions,
  ArtistCardImage,
  ArtistCardInfo,
} from "@/components/artist-card";
import { Button } from "@/components/ui/button";

const SearchPage = () => {
  return (
    <div className="space-y-5">
      <p className="font-semibold text-muted-foreground text-sm tracking-wide">
        Found 500+ playlists, 500+ tracks, 407 people.
      </p>
      <div className="space-y-7">
        {Array.from({ length: 3 }).map((_, index) => (
          <ArtistCard key={index}>
            <ArtistCardImage
              src="https://images.unsplash.com/photo-1484186139897-d5fc6b908812?q=80&w=880&auto=format&fit=crop"
              alt="artist logo"
            />
            <div className="flex-1 flex justify-between items-center">
              <ArtistCardInfo name="Kygo" location="Bergen" followers="1.51M" />
              <ArtistCardActions>
                <Button className="rounded-sm" size="sm">
                  Follow
                </Button>
              </ArtistCardActions>
            </div>
          </ArtistCard>
        ))}
      </div>
    </div>
  );
};

export default SearchPage;
