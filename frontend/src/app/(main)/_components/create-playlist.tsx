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
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  createPlaylistSchema,
  TCreatePlaylistSchema,
} from "../create-playlist-schema";
import Image from "next/image";

const CreatePlaylist = () => {
  const form = useForm<TCreatePlaylistSchema>({
    resolver: zodResolver(createPlaylistSchema),
    defaultValues: {
      title: "",
      type: "public",
    },
  });

  const onSubmit = (values: TCreatePlaylistSchema) => {
    console.log("values", values);
  };

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Playlist title<span className="text-rose-500 text-xs">*</span>
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
                          <RadioGroupItem value="public" />
                        </FormControl>
                        <FormLabel className="font-normal">Public</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center gap-3">
                        <FormControl>
                          <RadioGroupItem value="private" />
                        </FormControl>
                        <FormLabel className="font-normal">Private</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" size="sm">
              Save
            </Button>
          </div>
        </form>

        <div className="mt-6 space-y-5">
          <h2 className="text-lg font-semibold">
            Looking for more tracks? Add some from your likes.
          </h2>
          <div className="space-y-5">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="flex justify-between items-center">
                <div className="flex gap-2 items-center">
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
                  <div>
                    <h1 className="text-sm font-semibold text-muted-foreground">
                      Weeber
                    </h1>
                    <p className="text-sm font-medium line-clamp-1">
                      OneRepublic - Someday (WEEBER Remix)
                    </p>
                  </div>
                </div>
                <Button size="sm">Add to playlist</Button>
              </div>
            ))}
          </div>
        </div>
      </Form>
    </div>
  );
};

export default CreatePlaylist;
