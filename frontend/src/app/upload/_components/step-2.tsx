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
import { useDebounce } from "@/hooks/use-debounce";
import { useFileUpload } from "@/hooks/use-file-upload";
import { TagInput } from "emblor";
import { AlertCircleIcon, CameraIcon, XIcon } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { H3, P } from "shadcn-typography";
import {
  ACCEPTED_IMAGE_TYPES,
  MAX_COVER_SIZE,
  TUploadSchema,
} from "../upload-schema";

interface Step2Props {
  onNext: () => void;
  onBack: () => void;
}

const Step2 = ({ onNext, onBack }: Step2Props) => {
  const [activeTagIndex, setActiveTagIndex] = useState<number | null>(null);

  const form = useFormContext<TUploadSchema>();

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
      <div className="space-y-3">
        <H3 className="text-3xl font-bold">Basic Info</H3>
        <P className="text-muted-foreground tracking-wide font-medium">
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Aut id
          pariatur deleniti.
        </P>
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
              />
              {previewUrl ? (
                <div className="absolute inset-0">
                  <Image
                    fill
                    src={previewUrl}
                    alt={files[0]?.file?.name || "Uploaded image"}
                    className="size-full object-cover"
                  />
                </div>
              ) : (
                <div className="flex flex-col justify-end px-4 py-3 text-center h-full">
                  <Button size="lg" type="button" onClick={openFileDialog}>
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
                  onClick={() => removeFile(files[0]?.id)}
                  aria-label="Remove image"
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
          <div className="space-y-2">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Title
                    <span className="text-rose-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Enter title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-between items-center">
              <p className="text-muted-foreground select-none">
                soundcloud.com/schelpcenter/{slugPreview || "(no slug)"}
              </p>
            </div>
          </div>

          <FormField
            control={form.control}
            name="genre"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Genre <span className="text-rose-500">*</span>
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a genre" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="0" disabled>
                      Select Genre
                    </SelectItem>
                    <SelectItem value="pop">Pop</SelectItem>
                    <SelectItem value="rock">Rock</SelectItem>
                    <SelectItem value="hip-hop">Hip Hop</SelectItem>
                    <SelectItem value="electronic">Electronic</SelectItem>
                    <SelectItem value="jazz">Jazz</SelectItem>
                    <SelectItem value="classical">Classical</SelectItem>
                    <SelectItem value="country">Country</SelectItem>
                    <SelectItem value="reggae">Reggae</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="additionalTags"
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
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Description
                  <span className="text-rose-500">*</span>
                </FormLabel>
                <FormControl>
                  <Textarea placeholder="Enter title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack} type="button">
          Back
        </Button>
        <Button type="button" onClick={onNext}>
          Next
        </Button>
      </div>
    </div>
  );
};

export default Step2;
