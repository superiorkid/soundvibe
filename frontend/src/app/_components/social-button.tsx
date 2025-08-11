import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { VariantProps } from "class-variance-authority";
import { LucideIcon } from "lucide-react";
import React from "react";

interface SocialButtonProps
  extends React.ComponentProps<"button">,
    VariantProps<typeof buttonVariants> {}

const SocialButton = ({
  children,
  variant,
  size,
  className,
  ...props
}: SocialButtonProps) => {
  return (
    <Button
      className={cn("w-full", className)}
      size={size}
      variant={variant}
      {...props}
    >
      {children}
    </Button>
  );
};

interface SocialButtonIconProps {
  icon: LucideIcon | React.ComponentType<{ className?: string }>;
  className?: string;
  size?: number;
  strokeWidth?: number;
}

const SocialButtonIcon = ({
  icon: Icon,
  className,
  size,
  strokeWidth,
}: SocialButtonIconProps) => {
  return (
    <Icon
      size={size}
      strokeWidth={strokeWidth}
      className={cn("mr-2", className)}
    />
  );
};

interface SocialButtonTextProps {
  children: React.ReactNode;
  className?: string;
}

const SocialButtonText = ({ children, className }: SocialButtonTextProps) => {
  return <span className={className}>{children}</span>;
};

SocialButton.Icon = SocialButtonIcon;
SocialButton.Text = SocialButtonText;

export { SocialButton };
export type { SocialButtonIconProps, SocialButtonProps, SocialButtonTextProps };
