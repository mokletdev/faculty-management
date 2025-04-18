import { auth } from "@/server/auth";
import { forbidden } from "next/navigation";
import type { ReactNode } from "react";

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await auth();

  if (!session) return forbidden();

  return <>{children}</>;
}
