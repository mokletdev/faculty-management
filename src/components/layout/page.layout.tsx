import { cn } from "@/lib/utils";
import type { ReactNode } from "react";
import Navbar from "../ui/navbar";
import Footer from "../ui/footer";
import type { Session } from "next-auth";

export const PageContainer = ({
  children,
  className,
  isMainLayout = false,
  session,
}: {
  children?: ReactNode;
  className?: string;
  isMainLayout?: boolean;
  session?: Session | null;
}) => {
  return (
    <>
      {isMainLayout && <Navbar session={session} />}
      <main
        className={cn("h-full min-h-screen pt-[84px] sm:pt-[72px]", className)}
      >
        {children}
      </main>
      {isMainLayout && <Footer />}
    </>
  );
};
