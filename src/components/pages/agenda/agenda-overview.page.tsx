import { Button } from "@/components/ui/button";
import { parsePaginationParams } from "@/lib/parse-pagination-params";
import { getAgendas } from "@/server/retrievers/agenda";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { AgendaTable } from "./_components/agenda-table";
import { AgendaTableSkeleton } from "./_components/agenda-table-skeleton";

export const AgendaOverview = async ({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    pageSize?: string;
    search?: string;
  }>;
}) => {
  const { page, pageSize, search } = parsePaginationParams(await searchParams);
  const agendaData = await getAgendas(
    page ?? undefined,
    pageSize ?? undefined,
    search,
  );

  return (
    <div className="container mx-auto space-y-6 py-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Agenda Management
          </h1>
          <p className="text-muted-foreground">
            Manage faculty events and activities
          </p>
        </div>
        <Link href="/admin/agenda/new">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Agenda
          </Button>
        </Link>
      </div>
      <Suspense fallback={<AgendaTableSkeleton />}>
        <AgendaTable agendaData={agendaData} />
      </Suspense>
    </div>
  );
};
