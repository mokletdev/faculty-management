import { PageContainer } from "@/components/layout/page.layout";
import type { ReactNode } from "react";

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <PageContainer>{children}</PageContainer>
    </>
  );
}
