"use client";

import { Button } from "@/components/ui/button";
import { HardDriveUploadIcon } from "lucide-react";

const Step1 = () => {
  return (
    <div className="space-y-8 mt-5">
      <div className="space-y-3">
        <h1 className="text-3xl font-bold">Upload your audio files.</h1>
        <p className="text-muted-foreground tracking-wide font-medium">
          For best quality, use WAV, FLAC, AIFF, or ALAC. The maximum file size
          is 100MB uncompressed.
        </p>
      </div>

      <div className="border-2 rounded-lg border-dashed h-[534px] bg-zinc-50 space-y-9 flex justify-center items-center flex-col">
        <HardDriveUploadIcon size={60} />
        <p className="text-2xl font-bold">
          Drag and drop audio file to get started
        </p>
        <Button size="lg" className="text-lg">
          Choose file
        </Button>
      </div>

      <div className="flex justify-end gap-3 items-center">
        <Button>Cancel</Button>
        <Button>Next</Button>
      </div>
    </div>
  );
};

export default Step1;
