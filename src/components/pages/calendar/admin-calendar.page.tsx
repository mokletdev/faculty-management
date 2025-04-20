import { Button } from "@/components/ui/button";
import { H1 } from "@/components/ui/typography";
import { CalendarDays } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { CalendarView } from "./_components/calendar-view";
import { CalendarSkeleton } from "./_components/calendar-view-skeleton";

export const AdminCalendar = async () => {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-8 flex flex-col justify-between gap-y-2 md:flex-row md:items-center">
        <H1 className="text-primary-800 font-bold">Kalender Admin</H1>
        <Button asChild className="w-fit">
          <Link href={"/admin/agenda"}>
            <CalendarDays /> Kelola Agenda
          </Link>
        </Button>
      </div>
      <Suspense fallback={<CalendarSkeleton />}>
        <CalendarView />
      </Suspense>
    </div>
  );
};
