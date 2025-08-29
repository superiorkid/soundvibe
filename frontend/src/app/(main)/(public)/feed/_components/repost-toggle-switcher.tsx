"use client";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { parseAsBoolean, useQueryState } from "nuqs";

const RepostToggleSwitcher = () => {
  const [showRepost, setShowRepost] = useQueryState(
    "showRepost",
    parseAsBoolean.withDefault(true)
  );

  const handleToggle = (checked: boolean) => {
    setShowRepost(checked);
  };

  return (
    <div className="flex gap-1 items-center">
      <Label className="text-base font-medium text-muted-foreground">
        Reposts
      </Label>
      <Switch
        checked={showRepost}
        onCheckedChange={handleToggle}
        className="hover:cursor-pointer"
      />
    </div>
  );
};

export default RepostToggleSwitcher;
