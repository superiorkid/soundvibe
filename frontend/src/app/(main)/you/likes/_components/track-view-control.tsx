"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ContentDisplayEnum } from "@/enums/content-display-enum";
import { LayoutGridIcon, LayoutListIcon } from "lucide-react";
import { parseAsStringEnum, useQueryState } from "nuqs";

const TrackViewControl = () => {
  const [contentDisplay, setContentDisplay] = useQueryState(
    "display",
    parseAsStringEnum<ContentDisplayEnum>(
      Object.values(ContentDisplayEnum)
    ).withDefault(ContentDisplayEnum.grid)
  );

  return (
    <div className="flex gap-2 items-center">
      <Label className="mr-3">View</Label>
      <Button
        size="sm"
        variant={
          contentDisplay === ContentDisplayEnum.grid ? "default" : "secondary"
        }
        onClick={() => setContentDisplay(ContentDisplayEnum.grid)}
        className="hover:cursor-pointer"
      >
        <LayoutGridIcon strokeWidth={2} size={16} />
      </Button>
      <Button
        size="sm"
        variant={
          contentDisplay === ContentDisplayEnum.list ? "default" : "secondary"
        }
        onClick={() => setContentDisplay(ContentDisplayEnum.list)}
        className="hover:cursor-pointer"
      >
        <LayoutListIcon strokeWidth={2} size={16} />
      </Button>
    </div>
  );
};

export default TrackViewControl;
