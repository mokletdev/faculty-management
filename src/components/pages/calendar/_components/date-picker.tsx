"use client";

import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import * as React from "react";
import type { DateRange } from "react-day-picker";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface DatePickerProps {
  startDate?: Date;
  endDate?: Date;
  onChange: (start?: Date, end?: Date) => void;
  className?: string;
}

export const DatePicker = ({
  startDate,
  endDate,
  onChange,
  className,
}: DatePickerProps) => {
  const [date, setDate] = React.useState<DateRange | undefined>(
    startDate && endDate
      ? {
          from: startDate,
          to: endDate,
        }
      : undefined,
  );

  React.useEffect(() => {
    if (startDate && endDate) {
      setDate({
        from: startDate,
        to: endDate,
      });
    } else {
      setDate(undefined);
    }
  }, [startDate, endDate]);

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal",
              !date && "text-muted-foreground",
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Date range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={(selectedDate) => {
              setDate(selectedDate);
              onChange(selectedDate?.from, selectedDate?.to);
            }}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};
