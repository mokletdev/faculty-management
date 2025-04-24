import { PageContainer } from "@/components/layout/page.layout";
import { auth } from "@/server/auth";
import type { ReactNode } from "react";

export default async function MainLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await auth();
  return (
    <>
      <PageContainer isMainLayout session={session}>
        {children}
      </PageContainer>
    </>
  );
}
