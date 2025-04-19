import * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground selection:bg-primary-700 dark:bg-input/30 flex h-10 w-full min-w-0 rounded-full border border-neutral-200 bg-white px-3 py-1 text-base text-black shadow-xs transition-[color,box-shadow] outline-none selection:text-white file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-neutral-400 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-1",
        "aria-invalid:border-red-500 aria-invalid:ring-red-500 dark:aria-invalid:ring-red-500",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
