import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HeartIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { PlayerActions } from "../../_components/player-actions";
import CommentsEmpty from "./_components/comments-empty";
import Comments from "./_components/commets";
import TrackDescription from "./_components/track-description";
import TrackHeader from "./_components/track-header";
import UserCard from "./_components/user-card";

const DetailTrackPage = () => {
  const hasComments = true;

  return (
    <div>
      <TrackHeader />
      <div className="flex gap-6 mt-5">
        <div className="flex-1 space-y-6">
          <PlayerActions />
          <div className="flex gap-6">
            <UserCard />
            <div className="flex-1 space-y-8">
              <TrackDescription />
              <div>{!hasComments ? <CommentsEmpty /> : <Comments />}</div>
            </div>
          </div>
        </div>
        <div className="w-[363px] space-y-10">
          {/* fans */}
          <div className="-space-y-0.5">
            <h1 className="font-semibold uppercase text-sm">Fans</h1>
            <Tabs defaultValue="tab-1">
              <TabsList className="h-auto rounded-none border-b bg-transparent p-0 w-full">
                <TabsTrigger
                  value="tab-1"
                  className="data-[state=active]:after:bg-primary relative rounded-none py-2 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                >
                  Top
                </TabsTrigger>
                <TabsTrigger
                  value="tab-2"
                  className="data-[state=active]:after:bg-primary relative rounded-none py-2 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                >
                  First
                </TabsTrigger>
              </TabsList>
              <TabsContent value="tab-1" className="space-y-4">
                <p className="text-xs tracking-wide text-muted-foreground">
                  Fans who have played this track the most:
                </p>
                <div className="space-y-3">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <div key={index} className="flex px-2 gap-2">
                      <div className="flex gap-3">
                        <Label>{index + 1}</Label>
                        <Avatar className="size-9">
                          <AvatarImage src="https://github.com/shadcn.png" />
                          <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                      </div>
                      <div className="flex-1 flex justify-between items-center">
                        <Label>Mina Jack</Label>
                        <Label className="text-muted-foreground text-sm">
                          800 plays
                        </Label>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="tab-2" className="space-y-4">
                <p className="text-xs tracking-wide text-muted-foreground">
                  Fans who played this track in the first 7 days:
                </p>
                <div className="space-y-3">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <div key={index} className="flex px-2 gap-2">
                      <div className="flex gap-3">
                        <Label>{index + 1}</Label>
                        <Avatar className="size-9">
                          <AvatarImage src="https://github.com/shadcn.png" />
                          <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                      </div>
                      <div className="flex-1 flex justify-between items-center">
                        <Label>Not your mine</Label>
                        <Label className="text-muted-foreground text-sm">
                          100 plays
                        </Label>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <div>
            <p>SOON: related tracks here...</p>
          </div>

          {/* in playlists */}
          <div className="space-y-5">
            <div className="flex justify-between items-center">
              <h1 className="font-semibold uppercase text-sm">in playlist</h1>
              <Link
                href="#"
                className="text-xs text-muted-foreground tracking-wide"
              >
                View all
              </Link>
            </div>
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="flex gap-3 items-start">
                  <div className="relative size-14">
                    <Image
                      fill
                      src="https://images.unsplash.com/photo-1654110455429-cf322b40a906?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                      alt="playlist img"
                      loading="lazy"
                      decoding="async"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                  <div className="text-sm space-y-3.5">
                    <div>
                      <h1 className="font-bold text-muted-foreground">
                        Alex Pirlea
                      </h1>
                      <p className="font-semibold">House</p>
                    </div>
                    <button className="text-xs flex items-center gap-1">
                      <HeartIcon
                        className="fill-foreground"
                        size={12}
                        strokeWidth={2}
                      />
                      <span className="font-medium">12</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* likes */}
          <div className="space-y-5">
            <div className="flex justify-between items-center">
              <h1 className="font-semibold uppercase text-sm">14.3K likes</h1>
              <Link
                href="#"
                className="text-xs text-muted-foreground tracking-wide"
              >
                View all
              </Link>
            </div>
            <div className="flex -space-x-[1.4rem]">
              {Array.from({ length: 9 }).map((_, index) => (
                <Image
                  key={index}
                  className="ring-background rounded-full ring-2"
                  src="https://images.unsplash.com/photo-1628157588553-5eeea00af15c?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  width={60}
                  height={60}
                  alt="Avatar 01"
                />
              ))}
            </div>
          </div>

          {/* reposts */}
          <div className="space-y-5">
            <div className="flex justify-between items-center">
              <h1 className="font-semibold uppercase text-sm">14.3K reposts</h1>
              <Link
                href="#"
                className="text-xs text-muted-foreground tracking-wide"
              >
                View all
              </Link>
            </div>
            <div className="flex -space-x-[1.4rem]">
              {Array.from({ length: 9 }).map((_, index) => (
                <Image
                  key={index}
                  className="ring-background rounded-full ring-2"
                  src="https://images.unsplash.com/photo-1701615004837-40d8573b6652?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  width={60}
                  height={60}
                  alt="Avatar 01"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailTrackPage;
