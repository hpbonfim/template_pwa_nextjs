"use client";

import { forwardRef } from "react";

import { cn } from "@/utils";
import { Root } from "@radix-ui/react-label";

export const Label = forwardRef<
  React.ElementRef<typeof Root>,
  React.ComponentPropsWithoutRef<typeof Root>
>(function Label({ className, ...props }, ref) {
  return (
    <Root
      ref={ref}
      className={cn(
        "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
        className
      )}
      {...props}
    />
  );
});
