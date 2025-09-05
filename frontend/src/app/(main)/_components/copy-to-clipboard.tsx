"use client";

import { useState } from "react";
import { toast } from "sonner";

interface CopyToClipboardProps {
  text: string;
  onSuccess?: () => void;
  children: (props: {
    onClick: () => void;
    copied: boolean;
  }) => React.ReactNode;
}

const CopyToClipboard = ({
  children,
  text,
  onSuccess,
}: CopyToClipboardProps) => {
  const [copied, setCopied] = useState(false);

  const handleClick = async () => {
    await navigator.clipboard.writeText(text);
    toast.info("Link copied to clipboard");
    setCopied(true);
    onSuccess?.();
    setTimeout(() => setCopied(false), 2000);
  };

  return children({
    onClick: handleClick,
    copied,
  });
};

export default CopyToClipboard;
