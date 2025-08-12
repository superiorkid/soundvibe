"use client";

import { Button } from "@/components/ui/button";
import { useFileUpload } from "@/hooks/use-file-upload";
import { AlertCircleIcon, AudioLinesIcon, UploadIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useFormContext } from "react-hook-form";
import { H3, P } from "shadcn-typography";
import {
  ACCEPTED_AUDIO_TYPES,
  MAX_AUDIO_SIZE,
  TUploadSchema,
} from "../upload-schema";

interface Step1Props {
  onNext: () => void;
}

const Step1 = ({ onNext }: Step1Props) => {
  const router = useRouter();
  const form = useFormContext<TUploadSchema>();

  const onCancel = () => {
    const confirmed = window.confirm(
      "Are you sure you want to close this page?"
    );
    if (confirmed) {
      router.replace("/");
    }
  };

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
    accept: ACCEPTED_AUDIO_TYPES.join(","),
    maxSize: MAX_AUDIO_SIZE,
    onFilesChange: (files) => {
      form.setValue("audio", files.at(0)?.file as File);
    },
  });

  const audioFile = form.getValues("audio");
  const fileName = files[0]?.file.name || audioFile?.name || null;

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <H3 className="text-3xl font-bold">Upload your audio files.</H3>
        <P className="text-muted-foreground tracking-wide font-medium">
          For best quality, use WAV, FLAC, AIFF, or ALAC. The maximum file size
          is 100MB uncompressed.
        </P>
      </div>

      <div className="relative">
        {/* Drop area */}
        <div
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          data-dragging={isDragging || undefined}
          className="border-input border-2 data-[dragging=true]:bg-accent/50 has-[input:focus]:border-ring has-[input:focus]:ring-ring/50 relative flex min-h-[200px] flex-col items-center justify-center overflow-hidden rounded-xl border-dashed p-4 transition-colors has-[input:focus]:ring-[3px] h-[323px]"
        >
          <input
            {...getInputProps()}
            className="sr-only"
            aria-label="Upload audio file"
          />

          {fileName ? (
            <div className="flex flex-col items-center gap-2">
              <AudioLinesIcon size={60} strokeWidth={2} />{" "}
              <p
                className="text-lg font-semibold truncate max-w-xs"
                title={fileName}
              >
                {fileName}
              </p>
              <button
                type="button"
                onClick={() => removeFile(files[0]?.id)}
                className="text-destructive underline"
              >
                Remove file
              </button>
            </div>
          ) : (
            <div className="space-y-9 flex justify-center items-center flex-col">
              <UploadIcon size={54} strokeWidth={2} />
              <p className="2xl:text-2xl text-xl font-semibold">
                Drag and drop audio file to get started
              </p>
              <Button
                type="button"
                size="lg"
                className="text-lg"
                onClick={openFileDialog}
              >
                Choose file
              </Button>
            </div>
          )}
        </div>
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

      <div className="flex justify-end gap-3 items-center">
        <Button type="button" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="button" onClick={onNext} disabled={!fileName}>
          Next
        </Button>
      </div>
    </div>
  );
};

export default Step1;
