import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import Link from "next/link";

const AddToPlaylist = () => {
  return (
    <div>
      <Input
        placeholder="Filter playlist"
        className="rounded-none border-primary h-8"
      />

      <div className="space-y-4 mt-8">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="relative size-12">
                <Image
                  fill
                  src="https://images.unsplash.com/photo-1552058321-cdcc666cbfed?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="playlistn cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  decoding="async"
                  loading="lazy"
                  className="object-cover"
                />
              </div>
              <div className="space-y-0.5">
                <Link href="#" className="text-sm font-semibold line-clamp-1">
                  best remix
                </Link>
                <p className="text-sm text-muted-foreground">14</p>
              </div>
            </div>
            <Button
              size="sm"
              className="rounded-sm text-sm font-semibold hover:cursor-pointer hover:opacity-50"
              variant="secondary"
            >
              Add to playlist
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AddToPlaylist;
