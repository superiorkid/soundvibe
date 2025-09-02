"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useCreatePlaylist } from "@/hooks/tanstack/playlist";
import { TAudio } from "@/types/audio.type";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useForm } from "react-hook-form";
import {
  createPlaylistSchema,
  TCreatePlaylistSchema,
} from "../create-playlist-schema";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { TUser } from "@/types/user.type";

interface CreatePlaylistProps {
  audio: TAudio;
}

const CreatePlaylist = ({ audio }: CreatePlaylistProps) => {
  const { data: session } = authClient.useSession();
  const form = useForm<TCreatePlaylistSchema>({
    resolver: zodResolver(createPlaylistSchema),
    defaultValues: {
      title: "",
      type: "public",
      audio: audio.id,
    },
  });
  const titleWatch = form.watch("title");

  const { createPlaylistMutation, isPending, data } = useCreatePlaylist();
  const onSubmit = (values: TCreatePlaylistSchema) => {
    createPlaylistMutation(values);
  };

  return (
    <div>
      {!data ? (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="title"
              disabled={isPending}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Playlist title
                    <span className="text-rose-500 text-xs">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="rounded-none h-8 border-primary"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-between items-center">
              <FormField
                control={form.control}
                name="type"
                disabled={isPending}
                render={({ field }) => (
                  <FormItem className="flex items-center gap-8">
                    <FormLabel>Privacy:</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex items-center gap-4"
                      >
                        <FormItem className="flex items-center gap-3">
                          <FormControl>
                            <RadioGroupItem
                              disabled={field.disabled}
                              value="public"
                            />
                          </FormControl>
                          <FormLabel className="font-normal">Public</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center gap-3">
                          <FormControl>
                            <RadioGroupItem
                              disabled={field.disabled}
                              value="private"
                            />
                          </FormControl>
                          <FormLabel className="font-normal">Private</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                size="sm"
                disabled={!form.getValues("audio") || !titleWatch || isPending}
              >
                Save
              </Button>
            </div>
          </form>
        </Form>
      ) : (
        <div className="py-5">
          <p className="text-center">
            Playlist created successfully.{" "}
            <Link
              href={`/${(session?.user as TUser).displayUsername}/sets/${
                data.data?.slug
              }`}
              className="underline"
            >
              Go to playlist
            </Link>
          </p>
        </div>
      )}

      <div className="mt-6 flex items-center gap-2">
        <div className="size-10 relative">
          {audio.coverFile ? (
            <Image
              fill
              src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/audio/cover/${audio.id}`}
              alt="playlistn cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              decoding="async"
              loading="lazy"
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-amber-600/70 to-yellow-400/70 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
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
        <p className="line-clamp-1 text-sm font-semibold tracking-wide">
          <span className="text-muted-foreground">{audio.artist} -</span>{" "}
          <span>{audio.title}</span>
        </p>
      </div>
    </div>
  );
};

export default CreatePlaylist;
