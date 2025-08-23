"use client";

import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useGenres } from "@/hooks/tanstack/genre";
import { useDebounce } from "@/hooks/use-debounce";
import { useFileUpload } from "@/hooks/use-file-upload";
import { authClient } from "@/lib/auth-client";
import { TUser } from "@/types/user.type";
import { TagInput } from "emblor";
import {
  AlertCircleIcon,
  CameraIcon,
  GlobeIcon,
  InfoIcon,
  XIcon,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import {
  ACCEPTED_IMAGE_TYPES,
  MAX_COVER_SIZE,
  TUploadSchema,
} from "../upload-schema";

interface Step2Props {
  onNext: () => void;
  onBack: () => void;
  isSubmitting: boolean;
}

const Step2 = ({ onNext, onBack, isSubmitting }: Step2Props) => {
  const { data: session, isPending } = authClient.useSession();
  const [activeTagIndex, setActiveTagIndex] = useState<number | null>(null);

  const form = useFormContext<TUploadSchema>();
  const { genres, isPending: isGenrePending } = useGenres();

  const [
    { files, isDragging, errors },
    {
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      openFileDialog,
      removeFile,
      getInputProps,
    },
  ] = useFileUpload({
    accept: ACCEPTED_IMAGE_TYPES.join(","),
    maxSize: MAX_COVER_SIZE,
    onFilesChange: (files) => {
      form.setValue("cover", files.at(0)?.file as File);
    },
  });

  const coverImage = form.getValues("cover");

  // State to hold preview URL from existing form cover image file
  const [initialPreviewUrl, setInitialPreviewUrl] = useState<string | null>(
    null
  );

  useEffect(() => {
    if (coverImage && coverImage instanceof File) {
      const url = URL.createObjectURL(coverImage);
      setInitialPreviewUrl(url);
      return () => {
        URL.revokeObjectURL(url);
        setInitialPreviewUrl(null);
      };
    } else {
      setInitialPreviewUrl(null);
    }
  }, [coverImage]);

  // Prefer live upload preview, fallback to initial preview URL
  const previewUrl = files[0]?.preview || initialPreviewUrl || null;

  const titleWatch = form.watch("title");
  const debouncedTitle = useDebounce(titleWatch, 300);
  const slugPreview = debouncedTitle
    ? debouncedTitle
        .toLowerCase()
        .trim()
        .replace(/[\s\W-]+/g, "-")
        .replace(/^-+|-+$/g, "")
    : "";

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Basic Info</h2>
        <p className="text-muted-foreground mt-2">
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Aut id
          pariatur deleniti.
        </p>
      </div>

      <div className="flex space-x-6">
        <div>
          <div className="relative">
            {/* Drop area */}
            <div
              role="button"
              onClick={openFileDialog}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              data-dragging={isDragging || undefined}
              className="border-input hover:bg-accent/50 data-[dragging=true]:bg-accent/50 has-[input:focus]:border-ring has-[input:focus]:ring-ring/50 relative flex min-h-52 flex-col items-center justify-center overflow-hidden rounded-xl border border-dashed p-4 transition-colors has-disabled:pointer-events-none has-disabled:opacity-50 has-[img]:border-none has-[input:focus]:ring-[3px] size-80 bg-gradient-to-b from-amber-400 to-amber-600"
            >
              <input
                {...getInputProps()}
                className="sr-only"
                aria-label="Upload file"
                disabled={isSubmitting}
              />
              {previewUrl ? (
                <div className="absolute inset-0">
                  <Image
                    fill
                    src={previewUrl}
                    alt={files[0]?.file?.name || "Uploaded image"}
                    className="size-full object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
              ) : (
                <div className="flex flex-col justify-end px-4 py-3 text-center h-full">
                  <Button
                    size="lg"
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation(); // ✅ prevent bubbling to parent
                      openFileDialog();
                    }}
                    disabled={isSubmitting}
                  >
                    <CameraIcon size={18} strokeWidth={2} className="mr-1" />
                    Update image
                  </Button>
                </div>
              )}
            </div>
            {previewUrl && (
              <div className="absolute top-4 right-4">
                <button
                  type="button"
                  className="focus-visible:border-ring focus-visible:ring-ring/50 z-50 flex size-8 cursor-pointer items-center justify-center rounded-full bg-black/60 text-white transition-[color,box-shadow] outline-none hover:bg-black/80 focus-visible:ring-[3px]"
                  onClick={(e) => {
                    e.stopPropagation(); // ✅ prevent re-triggering drop area
                    removeFile(files[0]?.id);
                  }}
                  aria-label="Remove image"
                  disabled={isSubmitting}
                >
                  <XIcon className="size-4" aria-hidden="true" />
                </button>
              </div>
            )}
          </div>

          {errors.length > 0 && (
            <div
              className="text-destructive flex items-center gap-1 text-xs"
              role="alert"
            >
              <AlertCircleIcon className="size-3 shrink-0" />
              <span>{errors[0]}</span>
            </div>
          )}
        </div>

        <div className="flex-1 space-y-8">
          <FormField
            control={form.control}
            name="artist"
            disabled={isSubmitting}
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Artist
                  <span className="text-rose-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="Enter artists" {...field} />
                </FormControl>
                <div className="flex flex-col gap-2">
                  <div className="flex items-start gap-1">
                    <div className="mt-0.5">
                      <InfoIcon className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <p>Separate multiple artists with commas</p>
                  </div>
                  <div className="bg-muted rounded-md px-3 py-2 text-sm">
                    <p className="font-medium text-foreground">Example:</p>
                    <p className="text-muted-foreground">
                      Martin Garrix, Kygo, David Guetta
                    </p>
                  </div>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="title"
            disabled={isSubmitting}
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Title
                  <span className="text-rose-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="Enter title" {...field} />
                </FormControl>
                <div className="flex flex-col gap-2 py-1">
                  <div className="flex items-center gap-1.5">
                    <GlobeIcon className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-muted-foreground select-none text-sm font-mono bg-muted px-2 py-1 rounded">
                      soundcloud.com/
                      {isPending
                        ? "loading..."
                        : (session?.user as TUser)?.displayUsername ??
                          "unknown"}
                      /{slugPreview || "(no slug)"}
                    </span>
                  </div>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="genre"
            disabled={isSubmitting}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-1">
                  Genre <span className="text-rose-500">*</span>
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  value={field.value}
                  disabled={
                    isGenrePending ||
                    field.disabled ||
                    (genres?.data || []).length < 1
                  }
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      {isGenrePending ? (
                        <div className="flex items-center gap-2">
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                          <span>Loading genres...</span>
                        </div>
                      ) : (
                        <SelectValue placeholder="Select a genre" />
                      )}
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {isGenrePending ? (
                      <div className="flex items-center justify-center py-2 text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                          <span className="text-sm">Loading genres...</span>
                        </div>
                      </div>
                    ) : (genres?.data || []).length < 1 ? (
                      <div className="py-2 text-center text-sm text-muted-foreground">
                        No genres available
                      </div>
                    ) : (
                      <>
                        <SelectItem value="0" disabled className="hidden">
                          Select Genre
                        </SelectItem>
                        {(genres?.data || []).map((genre) => (
                          <SelectItem
                            key={genre.id}
                            value={genre.id}
                            className="capitalize transition-colors hover:bg-accent"
                          >
                            {genre.name}
                          </SelectItem>
                        ))}
                      </>
                    )}
                  </SelectContent>
                </Select>
                <FormMessage />

                {!isGenrePending && (genres?.data || []).length < 1 && (
                  <p className="text-sm text-amber-600 mt-2">
                    No genres available. Please try again later or contact
                    support.
                  </p>
                )}
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="additionalTags"
            disabled={isSubmitting}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Additional Tags</FormLabel>
                <FormControl>
                  <TagInput
                    tags={field.value!}
                    setTags={(newTags) => {
                      field.onChange(newTags);
                    }}
                    placeholder="Add a tag"
                    styleClasses={{
                      tagList: {
                        container: "gap-1",
                      },
                      input:
                        "rounded-md transition-[color,box-shadow] placeholder:text-muted-foreground/70 focus-visible:border-ring outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
                      tag: {
                        body: "relative h-7 bg-background border border-input hover:bg-background rounded-md font-medium text-xs ps-2 pe-7",
                        closeButton:
                          "absolute -inset-y-px -end-px p-0 rounded-s-none rounded-e-md flex size-7 transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] text-muted-foreground/80 hover:text-foreground",
                      },
                    }}
                    activeTagIndex={activeTagIndex}
                    setActiveTagIndex={setActiveTagIndex}
                    inlineTags={false}
                    inputFieldPosition="top"
                    disabled={field.disabled}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            disabled={isSubmitting}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="Enter Description" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={onBack}
          type="button"
          disabled={isSubmitting}
        >
          Back
        </Button>
        <Button type="button" onClick={onNext} disabled={isSubmitting}>
          Next
        </Button>
      </div>
    </div>
  );
};

export default Step2;
