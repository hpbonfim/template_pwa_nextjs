import { forwardRef } from "react";

import { tv } from "tailwind-variants";

export const TextareaStyles = tv({
  base: "placeholder: flex min-h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
});

export const Textarea = forwardRef<
  React.ComponentRef<"textarea">,
  React.ComponentProps<"textarea">
>(function Textarea({ className, ...props }, ref) {
  return (
    <textarea className={TextareaStyles({ className })} ref={ref} {...props} />
  );
});
