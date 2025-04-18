import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export const PageContainer = ({
  children,
  className,
}: {
  children?: ReactNode;
  className?: string;
}) => {
  return (
    <>
      {/* <Navbar /> */}
      <main className={cn("h-full min-h-screen", className)}>{children}</main>
      {/* <Footer /> */}
    </>
  );
};
