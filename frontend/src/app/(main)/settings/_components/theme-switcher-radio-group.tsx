"use client";

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useTheme } from "next-themes";

const ThemeSwitcherRadioGroup = () => {
  const { setTheme, theme } = useTheme();

  return (
    <RadioGroup
      defaultValue={theme}
      onValueChange={(value) => setTheme(value)}
      className="space-y-1.5"
    >
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="light" id="light" />
        <Label htmlFor="light">Light</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="dark" id="dark" />
        <Label htmlFor="dark">Dark</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="system" id="system" />
        <Label htmlFor="system">System</Label>
      </div>
    </RadioGroup>
  );
};

export default ThemeSwitcherRadioGroup;
