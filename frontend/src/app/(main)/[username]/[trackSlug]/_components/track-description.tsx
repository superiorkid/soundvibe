"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TAudio } from "@/types/audio.type";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface TrackDescriptionProps {
  audio: TAudio;
}

const TrackDescription = ({ audio }: TrackDescriptionProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [needsToggle, setNeedsToggle] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      const contentHeight = contentRef.current.scrollHeight;
      setNeedsToggle(contentHeight > 50);
    }
  }, [audio?.description]);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="relative">
      <div
        ref={contentRef}
        className={`relative overflow-hidden transition-all duration-300 ${
          isExpanded ? "h-auto" : "max-h-[50px]"
        }`}
      >
        <div className="space-y-3.5">
          <p className="whitespace-pre-line leading-relaxed text-foreground">
            {audio?.description || "No description provided"}
          </p>

          <div className="flex flex-wrap gap-2">
            {(audio.tags || []).map((tag, index) => (
              <Badge
                key={index}
                className="text-sm font-medium"
                variant="secondary"
              >
                #{tag.name}
              </Badge>
            ))}
          </div>
        </div>

        {!isExpanded && needsToggle && (
          <div className="absolute inset-x-0 bottom-0 h-6 bg-gradient-to-t from-background to-transparent pointer-events-none" />
        )}
      </div>

      {needsToggle && (
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleExpand}
          className="mt-2 h-8 px-2 text-sm text-muted-foreground hover:text-foreground"
        >
          {isExpanded ? (
            <>
              Show less
              <ChevronUpIcon className="ml-1 h-3 w-3" />
            </>
          ) : (
            <>
              Show more
              <ChevronDownIcon className="ml-1 h-3 w-3" />
            </>
          )}
        </Button>
      )}
    </div>
  );
};

export default TrackDescription;
