"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useFormContext } from "react-hook-form";
import { TUploadSchema } from "../upload-schema";

interface Step3Props {
  onBack: () => void;
}

const Step3 = ({ onBack }: Step3Props) => {
  const { getValues, formState } = useFormContext<TUploadSchema>();
  const { isSubmitting } = formState;

  const values = getValues();

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">
          Review Your Track
        </h2>
        <p className="text-muted-foreground mt-2">
          Confirm your details before uploading
        </p>
      </div>

      <div>
        <div className="space-y-6">
          {/* Audio Preview */}
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-medium text-muted-foreground">
              Audio Preview
            </h3>
            {values.audio ? (
              <audio
                controls
                src={URL.createObjectURL(values.audio)}
                className="w-full h-10"
              />
            ) : (
              <p className="text-sm text-muted-foreground italic">
                No audio provided
              </p>
            )}
          </div>

          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-medium text-muted-foreground">
              Cover Art
            </h3>
            {values.cover ? (
              <div className="flex">
                <Image
                  src={URL.createObjectURL(values.cover)}
                  alt="Cover preview"
                  className="w-40 h-40 object-cover rounded-lg shadow-sm"
                  decoding="async"
                  loading="lazy"
                  width={40}
                  height={40}
                />
              </div>
            ) : (
              <p className="text-sm text-muted-foreground italic">
                No cover provided
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-muted-foreground">
                Title
              </h3>
              <p
                className={
                  values.title ? "font-medium" : "text-muted-foreground italic"
                }
              >
                {values.title || "No title provided"}
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-medium text-muted-foreground">
                Genre
              </h3>
              <p
                className={
                  values.genre ? "font-medium" : "text-muted-foreground italic"
                }
              >
                {values.genre || "No genre selected"}
              </p>
            </div>

            <div className="space-y-3 md:col-span-2">
              <h3 className="text-sm font-medium text-muted-foreground">
                Description
              </h3>
              <p
                className={
                  values.description
                    ? "text-sm"
                    : "text-muted-foreground italic"
                }
              >
                {values.description || "No description provided"}
              </p>
            </div>

            <div className="space-y-3 md:col-span-2">
              <h3 className="text-sm font-medium text-muted-foreground">
                Tags
              </h3>
              {values.additionalTags?.length ? (
                <div className="flex flex-wrap gap-2">
                  {values.additionalTags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 bg-muted rounded-full text-xs font-medium"
                    >
                      {tag.text}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground italic text-sm">
                  No tags added
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <Button
          variant="outline"
          onClick={onBack}
          type="button"
          disabled={isSubmitting}
        >
          Back
        </Button>
        <Button type="submit" className="px-6" disabled={isSubmitting}>
          {isSubmitting ? "Processing..." : "Confirm & Upload"}
        </Button>
      </div>
    </div>
  );
};
export default Step3;
