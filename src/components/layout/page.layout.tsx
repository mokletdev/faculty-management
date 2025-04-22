import { cn } from "@/lib/utils";
import type { ReactNode } from "react";
import Navbar from "../ui/navbar";
import Footer from "../ui/footer";

export const PageContainer = ({
  children,
  className,
  isMainLayout = false,
}: {
  children?: ReactNode;
  className?: string;
  isMainLayout?: boolean;
}) => {
  return (
    <>
      {isMainLayout && <Navbar />}
      <main
        className={cn("h-full min-h-screen pt-[84px] sm:pt-[72px]", className)}
      >
        {children}
      </main>
      {isMainLayout && <Footer />}
    </>
  );
};
