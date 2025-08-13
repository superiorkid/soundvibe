"use client";

import { Badge } from "@/components/ui/badge";
import React, { useState } from "react";

const TrackDescription = () => {
  const [expanded, setExpanded] = useState<boolean>(false);

  const fullText = `Artists: Vanotek, Eneli, N.O.A.H
Label: Global Records
Remix Composer: N.O.A.H
Year: 2018
Genre: Deep House

Download for free on The Artist Union:
theartistunion.com/tracks/c7d12b`;

  const previewText =
    fullText.length > 100 ? fullText.slice(0, 100) + "..." : fullText;

  return (
    <div className="space-y-3.5">
      <p className="whitespace-pre-line leading-relaxed">
        {expanded ? fullText : previewText}
      </p>

      <button
        className="text-blue-600 text-sm font-medium hover:underline"
        onClick={() => setExpanded((prev) => !prev)}
      >
        {expanded ? "Show less" : "Show more"}
      </button>

      <div className="flex space-x-3 flex-wrap space-y-2">
        {Array.from({ length: 16 }).map((_, index) => (
          <Badge
            key={index}
            className="text-sm font-medium"
            variant="secondary"
          >
            #tag{index}
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default TrackDescription;
