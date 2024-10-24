import { forwardRef } from "react";

import { tv } from "tailwind-variants";

export const InputStyles = tv({
  base: "placeholder: flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background transition file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
});

export const Input = forwardRef<
  React.ComponentRef<"input">,
  React.ComponentProps<"input">
>(function Input({ className, type, ...props }, ref) {
  return (
    <input
      type={type}
      className={InputStyles({ className })}
      ref={ref}
      {...props}
    />
  );
});
