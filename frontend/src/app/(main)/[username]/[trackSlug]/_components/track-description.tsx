"use client";

import { Badge } from "@/components/ui/badge";
import React, { useState } from "react";

const TrackDescription = () => {
  const [expanded, setExpanded] = useState(false);
  const [tagsExpanded, setTagsExpanded] = useState(false);

  const fullText = `Artists: Vanotek, Eneli, N.O.A.H
Label: Global Records
Remix Composer: N.O.A.H
Year: 2018
Genre: Deep House

Download for free on The Artist Union:
theartistunion.com/tracks/c7d12b`;

  const previewText =
    fullText.length > 100 ? fullText.slice(0, 100) + "..." : fullText;

  const tags = Array.from({ length: 16 }).map((_, index) => `#tag${index}`);

  return (
    <div className="space-y-3.5">
      {/* Description */}
      <p className="whitespace-pre-line leading-relaxed">
        {expanded ? fullText : previewText}
      </p>

      <button
        className="text-blue-600 text-sm font-medium hover:underline"
        onClick={() => setExpanded((prev) => !prev)}
      >
        {expanded ? "Show less" : "Show more"}
      </button>

      {/* Tags */}
      <div className="flex flex-wrap gap-2">
        {(tagsExpanded ? tags : tags.slice(0, 5)).map((tag, index) => (
          <Badge
            key={index}
            className="text-sm font-medium"
            variant="secondary"
          >
            {tag}
          </Badge>
        ))}
      </div>

      {tags.length > 5 && (
        <button
          className="text-blue-600 text-sm font-medium hover:underline"
          onClick={() => setTagsExpanded((prev) => !prev)}
        >
          {tagsExpanded ? "Show less tags" : "Show more tags"}
        </button>
      )}
    </div>
  );
};

export default TrackDescription;
