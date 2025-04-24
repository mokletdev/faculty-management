import { SectionContainer } from "@/components/layout/section.layout";
import { auth } from "@/server/auth";
import {
  getGoogleCalendarId,
  getShareableCalendarUrl,
} from "@/server/retrievers/calendar";
import { Suspense } from "react";
import { CalendarView } from "./_components/calendar-view";
import { CalendarSkeleton } from "./_components/calendar-view-skeleton";

export const UserAgenda = async () => {
  const session = await auth();

  const calendarId = session ? await getGoogleCalendarId() : null;

  const calendarLink = calendarId
    ? getShareableCalendarUrl(calendarId)
    : undefined;

  return (
    <SectionContainer>
      <Suspense fallback={<CalendarSkeleton />}>
        <CalendarView calendarLink={calendarLink} />
      </Suspense>
    </SectionContainer>
  );
};
