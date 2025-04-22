import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

export const SectionContainer = ({
  children,
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) => {
  return (
    <section {...props} className={cn("w-full p-[124px]", className)}>
      <div className="mx-auto w-full max-w-7xl">{children}</div>
    </section>
  );
};
