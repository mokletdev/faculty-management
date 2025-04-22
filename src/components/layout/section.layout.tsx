import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

export const SectionContainer = ({
  children,
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) => {
  return (
    <section
      {...props}
      className={cn(
        "w-full px-[20px] py-[52px] sm:p-[70px] xl:p-[158px]",
        className,
      )}
    >
      <div className="mx-auto w-full max-w-7xl">{children}</div>
    </section>
  );
};
