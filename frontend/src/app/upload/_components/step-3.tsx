"use client";

import { Button } from "@/components/ui/button";
import { useFormContext } from "react-hook-form";
import { TUploadSchema } from "../upload-schema";

interface Step3Props {
  onBack: () => void;
}

const Step3 = ({ onBack }: Step3Props) => {
  const { getValues } = useFormContext<TUploadSchema>();
  const values = getValues();

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Confirm Your Details</h2>
      <p className="text-muted-foreground">
        Please review the details below before confirming.
      </p>

      <div className="bg-background">
        <dl className="divide-y divide-gray-100">
          {/* Audio */}
          <div className="px-4 py-3 grid grid-cols-3 gap-4">
            <dt className="font-medium">Audio</dt>
            <dd className="col-span-2">
              {values.audio ? (
                <audio
                  controls
                  src={URL.createObjectURL(values.audio)}
                  className="w-full"
                />
              ) : (
                <span className="text-gray-500 italic">No audio provided</span>
              )}
            </dd>
          </div>

          {/* Title */}
          <div className="px-4 py-3 grid grid-cols-3 gap-4">
            <dt className="font-medium">Title</dt>
            <dd className="col-span-2">{values.title || "-"}</dd>
          </div>

          {/* Prefix */}
          <div className="px-4 py-3 grid grid-cols-3 gap-4">
            <dt className="font-medium">Prefix</dt>
            <dd className="col-span-2">{values.prefix || "-"}</dd>
          </div>

          {/* Genre */}
          <div className="px-4 py-3 grid grid-cols-3 gap-4">
            <dt className="font-medium">Genre</dt>
            <dd className="col-span-2">{values.genre || "-"}</dd>
          </div>

          {/* Additional Tags */}
          <div className="px-4 py-3 grid grid-cols-3 gap-4">
            <dt className="font-medium">Additional Tags</dt>
            <dd className="col-span-2">
              {values.additionalTags?.length ? (
                <div className="flex flex-wrap gap-2">
                  {values.additionalTags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-gray-100 rounded text-sm"
                    >
                      {tag.text}
                    </span>
                  ))}
                </div>
              ) : (
                <span className="text-gray-500 italic">No tags</span>
              )}
            </dd>
          </div>

          {/* Description */}
          <div className="px-4 py-3 grid grid-cols-3 gap-4">
            <dt className="font-medium">Description</dt>
            <dd className="col-span-2">{values.description || "-"}</dd>
          </div>

          {/* Cover Image */}
          <div className="px-4 py-3 grid grid-cols-3 gap-4">
            <dt className="font-medium">Cover</dt>
            <dd className="col-span-2">
              {values.cover ? (
                <img
                  src={URL.createObjectURL(values.cover)}
                  alt="Cover preview"
                  className="w-32 h-32 object-cover rounded"
                />
              ) : (
                <span className="text-gray-500 italic">No cover provided</span>
              )}
            </dd>
          </div>
        </dl>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack} type="button">
          Back
        </Button>
        <Button type="submit">Confirm & Save</Button>
      </div>
    </div>
  );
};

export default Step3;
