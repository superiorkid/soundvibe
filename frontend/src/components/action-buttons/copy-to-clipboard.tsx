"use client";

import { Button } from "@/components/ui/button";
import { CheckIcon, CopyIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface CopyToClipboardProps {
  text: string;
  onSuccess?: () => void;
}

const CopyToClipboard = ({ text, onSuccess }: CopyToClipboardProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    toast.info("Copied to clipboard");
    setCopied(true);
    onSuccess?.();
    setTimeout(() => setCopied(false), 5000);
  };

  return (
    <Button
      variant="secondary"
      size="sm"
      onClick={handleCopy}
      className="hover:cursor-pointer"
    >
      {copied ? <CheckIcon size={16} /> : <CopyIcon size={16} />}
    </Button>
  );
};

export default CopyToClipboard;
