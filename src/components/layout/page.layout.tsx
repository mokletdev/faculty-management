import { cn } from "@/lib/utils";
import type { ReactNode } from "react";
import Navbar from "../ui/navbar";
import Footer from "../ui/footer";

export const PageContainer = ({
  children,
  className,
}: {
  children?: ReactNode;
  className?: string;
}) => {
  return (
    <>
      <Navbar />
      <main className={cn("h-full min-h-screen", className)}>{children}</main>
      <Footer />
    </>
  );
};
