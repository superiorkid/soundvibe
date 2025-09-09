"use client";

import {
  playlistType,
  TUpdatePlaylistSchema,
  updatePlaylistSchema,
} from "@/app/(main)/create-playlist-schema";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { Textarea } from "@/components/ui/textarea";
import { useUpdatePlaylist } from "@/hooks/tanstack/playlist";
import { useFileUpload } from "@/hooks/use-file-upload";
import { TPlaylist } from "@/types/playlist-type";
import { zodResolver } from "@hookform/resolvers/zod";
import { PencilIcon, Trash2Icon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";

interface EditPlaylistDialogProps {
  playlist: TPlaylist;
}

const EditPlaylistDialog = ({ playlist }: EditPlaylistDialogProps) => {
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const form = useForm<TUpdatePlaylistSchema>({
    resolver: zodResolver(updatePlaylistSchema),
    defaultValues: {
      title: playlist.title || "",
      description: playlist.description || "",
      type: playlist.type || "public",
      coverFile: undefined,
      coverUrl: playlist.playlistCoverFile?.url || "",
    },
  });

  const [{ files }, { removeFile, openFileDialog, getInputProps }] =
    useFileUpload({
      accept: "image/*",
      onFilesChange: (files) => {
        form.setValue("coverFile", files.at(0)?.file as File);
      },
    });

  const previewUrl = files[0]?.preview || null;
  const fileName = files[0]?.file.name || null;

  const { isPending, updatePlaylistMutation } = useUpdatePlaylist({
    playlistId: playlist.id,
    onSuccess: () => {
      setOpenDialog(false);
    },
  });

  const onSubmit = (values: TUpdatePlaylistSchema) => {
    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("type", values.type);
    if (values.description) formData.append("description", values.description);
    if (values.coverFile) {
      formData.append("coverFile", values.coverFile);
    }

    updatePlaylistMutation(formData);
  };

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger asChild>
        <Button size="sm" variant="secondary" className="hover:cursor-pointer">
          <PencilIcon strokeWidth={2} size={16} />
        </Button>
      </DialogTrigger>
      <DialogContent className="min-w-[47rem]">
        <DialogHeader>
          <DialogTitle>Update Playlist</DialogTitle>
          <DialogDescription>
            Update your playlist details, including title, description, cover
            image, and privacy settings.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form className="flex gap-6" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="size-67 relative flex flex-col items-center overflow-hidden rounded-md">
              {previewUrl ? (
                <Image
                  fill
                  src={previewUrl}
                  alt="playlist cover"
                  className="object-cover"
                />
              ) : form.getValues("coverUrl") ? (
                <Image
                  fill
                  src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/playlists/cover/${playlist.id}`}
                  alt="playlist cover"
                  className="object-cover"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-amber-600/70 to-yellow-400/70 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="48"
                    height="48"
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

              {/* Upload controls */}
              <div className="absolute bottom-3 flex px-3 py-2">
                <div className="flex gap-2">
                  <Button
                    type="button"
                    size="sm"
                    onClick={openFileDialog}
                    aria-haspopup="dialog"
                    className="hover:cursor-pointer"
                    disabled={isPending}
                  >
                    {fileName ? "Change image" : "Upload image"}
                  </Button>

                  {(fileName || form.getValues("coverUrl")) && (
                    <Button
                      type="button"
                      size="sm"
                      variant="destructive"
                      onClick={() => {
                        removeFile(files[0]?.id);
                        form.setValue("coverFile", undefined);
                        form.setValue("coverUrl", "");
                      }}
                      className="hover:cursor-pointer"
                      disabled={isPending}
                    >
                      <Trash2Icon size={16} strokeWidth={2} />
                    </Button>
                  )}
                </div>
                <input
                  {...getInputProps()}
                  className="sr-only"
                  aria-label="Upload image file"
                  tabIndex={-1}
                />
              </div>
            </div>
            <div className="flex-1 p-2 space-y-7">
              <FormField
                control={form.control}
                name="title"
                disabled={isPending}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                disabled={isPending}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter description" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                disabled={isPending}
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Privacy</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col"
                        disabled={field.disabled}
                      >
                        {playlistType.map((type, index) => (
                          <FormItem
                            className="flex items-center gap-3"
                            key={index}
                          >
                            <FormControl>
                              <RadioGroupItem value={type} />
                            </FormControl>
                            <FormLabel className="font-normal capitalize">
                              {type}
                            </FormLabel>
                          </FormItem>
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-3 items-center">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="hover:cursor-pointer"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="hover:cursor-pointer"
                >
                  Save
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditPlaylistDialog;
