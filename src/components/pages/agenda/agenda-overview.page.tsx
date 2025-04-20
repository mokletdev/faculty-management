import { PageContainer } from "@/components/layout/page.layout";
import { SectionContainer } from "@/components/layout/section.layout";
import { Button } from "@/components/ui/button";
import { BodyBase, H2 } from "@/components/ui/typography";
import { parsePaginationParams } from "@/lib/parse-pagination-params";
import { getAgendas } from "@/server/retrievers/agenda";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { AgendaTableSkeleton } from "./_components/agenda-table-skeleton";
import { AgendaTable } from "./_components/agenda-table/table";

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
    <PageContainer>
      <SectionContainer>
        <div className="container mx-auto space-y-6 py-6">
          <div className="flex flex-col items-start justify-between gap-y-4 md:flex-row md:items-center">
            <div>
              <H2 className="text-primary-800 mb-1 font-bold tracking-tight">
                Agenda Management
              </H2>
              <BodyBase className="text-neutral-500">
                Manage faculty events and activities
              </BodyBase>
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
      </SectionContainer>
    </PageContainer>
  );
};
