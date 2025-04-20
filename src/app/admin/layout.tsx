import { PageContainer } from "@/components/layout/page.layout";
import { SectionContainer } from "@/components/layout/section.layout";
import { auth } from "@/server/auth";
import { forbidden } from "next/navigation";
import type { ReactNode } from "react";

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await auth();

  if (session?.user.role !== "ADMIN") return forbidden();

  return (
    <PageContainer>
      <SectionContainer>{children}</SectionContainer>
    </PageContainer>
  );
}
