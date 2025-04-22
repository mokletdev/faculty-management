"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import type { Priority } from "@prisma/client";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Filter,
  Loader2,
  RefreshCw,
} from "lucide-react";
import moment from "moment";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState, type FC } from "react";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import { AgendaDetailsDialog } from "./agenda-details-dialog";

import {
  SearchableSelect,
  type SearchResult,
} from "@/components/ui/searchable-select";
import { H2 } from "@/components/ui/typography";
import "@/styles/calendar.css";
import type { AgendaWithRoom, FilterOptions, RoomSearchResult } from "@/types";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { GoogleCalendarLink } from "./google-calendar-url";

const localizer = momentLocalizer(moment);

export const CalendarView: FC<{ calendarLink?: string }> = ({
  calendarLink,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [agendas, setAgendas] = useState<AgendaWithRoom[]>([]);
  const [selectedAgenda, setSelectedAgenda] = useState<AgendaWithRoom | null>(
    null,
  );
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [date, setDate] = useState(() => {
    const dateParam = searchParams.get("date");
    return dateParam ? new Date(dateParam) : new Date();
  });
  const [view, setView] = useState(() => {
    const viewParam = searchParams.get("view");
    return viewParam && ["month", "week", "day", "agenda"].includes(viewParam)
      ? viewParam
      : "month";
  });
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<FilterOptions>(() => {
    const priority = searchParams.get("priority");
    const roomId = searchParams.get("roomId");
    const initialFilters: FilterOptions = {};

    if (priority && ["LOW", "MEDIUM", "HIGH"].includes(priority)) {
      initialFilters.priority = priority as Priority;
    }

    if (roomId) {
      initialFilters.roomId = roomId;
    }

    return initialFilters;
  });
  const [showFilters, setShowFilters] = useState(false);

  const updateSearchParams = () => {
    const params = new URLSearchParams();

    params.set("date", date.toISOString());

    params.set("view", view);

    if (filters.priority) {
      params.set("priority", filters.priority);
    }

    if (filters.roomId) {
      params.set("roomId", filters.roomId);
    }

    router.replace(`?${params.toString()}`, { scroll: false });
  };

  useEffect(() => {
    updateSearchParams();
  }, [date, view, filters]);

  const getDateRange = () => {
    const currentDate = new Date(date);

    if (view === "month") {
      const startDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        1,
      );
      const endDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        0,
        23,
        59,
        59,
      );
      return { startDate, endDate };
    } else if (view === "week") {
      const day = currentDate.getDay();
      const diff = currentDate.getDate() - day;
      const startDate = new Date(currentDate);
      startDate.setDate(diff);
      startDate.setHours(0, 0, 0, 0);

      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 6);
      endDate.setHours(23, 59, 59, 999);

      return { startDate, endDate };
    } else if (view === "day") {
      const startDate = new Date(currentDate);
      startDate.setHours(0, 0, 0, 0);

      const endDate = new Date(currentDate);
      endDate.setHours(23, 59, 59, 999);

      return { startDate, endDate };
    }

    const startDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1,
    );
    const endDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0,
      23,
      59,
      59,
    );
    return { startDate, endDate };
  };

  const fetchAgendas = async () => {
    try {
      setIsLoading(true);
      const { startDate, endDate } = getDateRange();

      const response = await fetch("/api/calendar", {
        method: "POST",
        body: JSON.stringify({
          ...filters,
          startDate,
          endDate,
        }),
      });
      if (!response.ok) throw new Error("Gagal mendapatkan agenda");

      const data = (await response.json()) as AgendaWithRoom[];

      setAgendas(data);
    } catch (error) {
      console.error("Failed to fetch agendas:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAgendas().catch((err) => console.error(err));
  }, [date, view, filters]);

  const events = useMemo(
    () =>
      agendas.map((agenda) => ({
        id: agenda.id,
        title: agenda.title,
        start: new Date(agenda.startTime),
        end: new Date(agenda.endTime),
        resource: agenda,
      })),
    [agendas],
  );

  const handleSelectEvent = (event: any) => {
    setSelectedAgenda(event.resource);
    setIsDetailsOpen(true);
  };

  const eventPropGetter = (event: any) => {
    const priority = event.resource.priority;
    let backgroundColor = "";
    let borderColor = "";

    switch (priority) {
      case "HIGH":
        backgroundColor = "rgba(239, 68, 68, 0.9)"; // red-500 with opacity
        borderColor = "#dc2626"; // red-600
        break;
      case "MEDIUM":
        backgroundColor = "rgba(249, 115, 22, 0.9)"; // orange-500 with opacity
        borderColor = "#ea580c"; // orange-600
        break;
      case "LOW":
        backgroundColor = "rgba(34, 197, 94, 0.9)"; // green-500 with opacity
        borderColor = "#16a34a"; // green-600
        break;
      default:
        backgroundColor = "rgba(59, 130, 246, 0.9)"; // blue-500 with opacity
        borderColor = "#2563eb"; // blue-600
    }

    return {
      style: {
        backgroundColor,
        borderLeft: `4px solid ${borderColor}`,
        borderRadius: "6px",
        color: "white",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        padding: "4px 8px",
        fontWeight: "500",
        display: "block",
      },
    };
  };

  const handlePriorityChange = (value: string) => {
    if (value === "all") {
      const { priority, ...rest } = filters;
      setFilters(rest);
    } else {
      setFilters({ ...filters, priority: value as Priority });
    }
  };

  const handleRoomChange = (value: string) => {
    if (value === "all") {
      const { roomId, ...rest } = filters;
      setFilters(rest);
    } else {
      setFilters({ ...filters, roomId: value });
    }
  };

  const handleResetFilters = () => {
    setShowFilters(false);
    setFilters({});
  };

  const handleRefresh = () => {
    fetchAgendas().catch((err) => console.error(err));
  };

  const CustomToolbar = ({ label, onNavigate, onView }: any) => {
    const searchRooms = async (query: string): Promise<SearchResult[]> => {
      const response = await fetch(
        `/api/room/search?q=${encodeURIComponent(query)}`,
      );
      if (!response.ok) throw new Error("Gagal mencari ruangan");

      const results = (await response.json()) as RoomSearchResult[];
      return results.map((room) => ({
        id: room.id,
        display: room.name,
      }));
    };

    return (
      <div className="mb-4 flex flex-col gap-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          {/* Left Controls */}
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => onNavigate("TODAY")}
              className="rounded-full"
            >
              <CalendarDays className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => onNavigate("PREV")}
              className="rounded-full"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => onNavigate("NEXT")}
              className="rounded-full"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
            <H2 className="ml-2 text-lg font-semibold md:text-xl">{label}</H2>
          </div>

          {/* Right Controls */}
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className={cn("gap-2", showFilters && "bg-muted")}
            >
              <Filter className="h-4 w-4" />
              Filters
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              className="gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
            <Tabs
              defaultValue={view}
              value={view}
              onValueChange={(v: any) => onView(v)}
              className="w-full sm:w-auto"
            >
              <TabsList className="grid w-full grid-cols-2 sm:w-[300px] sm:grid-cols-4">
                <TabsTrigger value="month">Month</TabsTrigger>
                <TabsTrigger value="week">Week</TabsTrigger>
                <TabsTrigger value="day">Day</TabsTrigger>
                <TabsTrigger value="agenda">List</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        {/* Filter Section */}
        {showFilters && (
          <div className="animate-in fade-in-0 slide-in-from-top-5 mt-10 grid grid-cols-1 gap-3 rounded-lg border border-neutral-200 bg-white p-4 duration-300 md:grid-cols-3">
            <div>
              <Select
                value={filters.priority ?? "all"}
                onValueChange={handlePriorityChange}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Filter by priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="LOW">Low Priority</SelectItem>
                  <SelectItem value="MEDIUM">Medium Priority</SelectItem>
                  <SelectItem value="HIGH">High Priority</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <SearchableSelect
              placeholder="Filter ruangan..."
              searchPlaceholder="Cari ruangan..."
              value={filters.roomId}
              onChange={(value) => handleRoomChange(value as string)}
              searchFunction={searchRooms}
              className="w-full"
            />

            <div className="flex justify-end gap-x-1 md:col-span-3">
              <Button variant="outline" size="sm" onClick={handleResetFilters}>
                Reset Filters
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(false)}
              >
                Close
              </Button>
            </div>
          </div>
        )}

        {/* Priority Legend */}
        <div className="mt-6 mb-2 flex flex-wrap gap-2">
          <Badge
            variant="outline"
            className="border-red-600 bg-red-500/90 text-white"
          >
            High Priority
          </Badge>
          <Badge
            variant="outline"
            className="border-orange-600 bg-orange-500/90 text-white"
          >
            Medium Priority
          </Badge>
          <Badge
            variant="outline"
            className="border-green-600 bg-green-500/90 text-white"
          >
            Low Priority
          </Badge>
          {calendarLink && <GoogleCalendarLink calendarLink={calendarLink} />}
        </div>
      </div>
    );
  };

  return (
    <div className="h-[80vh] rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
      {isLoading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center rounded-xl bg-white/50 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-2 rounded-lg bg-white p-6 shadow-lg">
            <Loader2 className="text-primary h-8 w-8 animate-spin" />
            <p className="text-muted-foreground text-sm">
              Loading calendar data...
            </p>
          </div>
        </div>
      )}

      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: "100%" }}
        onSelectEvent={handleSelectEvent}
        eventPropGetter={eventPropGetter}
        date={date}
        onNavigate={setDate}
        view={view as any}
        onView={(newView) => setView(newView)}
        views={[Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA]}
        components={{
          toolbar: CustomToolbar,
        }}
        popup
        className="modern-calendar"
      />

      {selectedAgenda && (
        <AgendaDetailsDialog
          agenda={selectedAgenda}
          open={isDetailsOpen}
          onOpenChange={setIsDetailsOpen}
        />
      )}
    </div>
  );
};
