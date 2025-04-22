import { Button } from "@/components/ui/button";
import { H2 } from "@/components/ui/typography";
import { getGoogleCalendarId } from "@/server/retrievers/calendar";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { CalendarSettingsForm } from "./_components/calendar-id-settings";
import { notFound } from "next/navigation";

export const CalendarSettings = async () => {
  const calendarId = await getGoogleCalendarId();

  if (!calendarId) return notFound();

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <H2 className="text-primary-800 mb-1 font-bold tracking-tight">
            Pengaturan Google Calendar
          </H2>
          <p className="text-muted-foreground">
            Kelola ID Google Calendar yang dapat dibagikan untuk sinkronisasi
            agenda.
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/admin">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali
          </Link>
        </Button>
      </div>

      <div className="mx-auto max-w-2xl">
        <CalendarSettingsForm existingCalendarId={calendarId} />
      </div>
    </div>
  );
};
