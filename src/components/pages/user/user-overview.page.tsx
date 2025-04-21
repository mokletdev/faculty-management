import { TableSkeleton } from "@/components/skeletons/table-skeleton";
import { Button } from "@/components/ui/button";
import { BodyBase, H2 } from "@/components/ui/typography";
import { parsePaginationParams } from "@/lib/parse-pagination-params";
import { getUsers } from "@/server/retrievers/user";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { UserTable } from "./_components/user-table/table";

export const UserOverview = async ({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    pageSize?: string;
    search?: string;
  }>;
}) => {
  const { page, pageSize, search } = parsePaginationParams(await searchParams);
  const userData = await getUsers(
    page ?? undefined,
    pageSize ?? undefined,
    search,
  );

  return (
    <div className="container mx-auto space-y-6 py-6">
      <div className="flex flex-col items-start justify-between gap-y-4 md:flex-row md:items-center">
        <div>
          <H2 className="text-primary-800 mb-1 font-bold tracking-tight">
            Manajemen Akun
          </H2>
          <BodyBase className="text-neutral-500">
            Kelola pengguna yang terdaftar di aplikasi FEMS.
          </BodyBase>
        </div>
        <Button asChild>
          <Link href="/admin/user/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Tambah Akun
          </Link>
        </Button>
      </div>
      <Suspense fallback={<TableSkeleton />}>
        <UserTable userData={userData} />
      </Suspense>
    </div>
  );
};
