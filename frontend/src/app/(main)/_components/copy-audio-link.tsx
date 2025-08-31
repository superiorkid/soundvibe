"use client";

import { useState } from "react";
import { toast } from "sonner";

interface CopyAudioLinkProps {
  url: string;
  onSuccess?: () => void;
  children: (props: {
    onClick: () => void;
    copied: boolean;
  }) => React.ReactNode;
}

const CopyAudioLink = ({ children, url, onSuccess }: CopyAudioLinkProps) => {
  const [copied, setCopied] = useState(false);

  const handleClick = async () => {
    await navigator.clipboard.writeText(url);
    toast.info("Audio link copied to clipboard");
    setCopied(true);
    onSuccess?.();
    setTimeout(() => setCopied(false), 2000);
  };

  return children({
    onClick: handleClick,
    copied,
  });
};

export default CopyAudioLink;
