"use client";

import { ChevronLeft, ChevronRight, Clock } from "lucide-react";
import * as React from "react";
import { DayPicker } from "react-day-picker";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

type CalendarTimePickerProps = React.ComponentProps<typeof DayPicker> & {
  mode?: "default" | "range" | "datetime";
  selectedTime?: string;
  onTimeChange?: (time: string) => void;
};

function CalendarTimePicker({
  className,
  classNames,
  showOutsideDays = true,
  mode = "default",
  selectedTime,
  onTimeChange,
  ...props
}: CalendarTimePickerProps) {
  const [hour, setHour] = React.useState<string>(
    selectedTime ? selectedTime.split(":")[0] : "12",
  );
  const [minute, setMinute] = React.useState<string>(
    selectedTime ? selectedTime.split(":")[1] : "00",
  );
  const [period, setPeriod] = React.useState<string>(
    selectedTime && parseInt(selectedTime.split(":")[0]) >= 12 ? "PM" : "AM",
  );

  // Generate hours (1-12)
  const hours = Array.from({ length: 12 }, (_, i) =>
    (i + 1).toString().padStart(2, "0"),
  );

  // Generate minutes (00-55, increment by 5)
  const minutes = Array.from({ length: 12 }, (_, i) =>
    (i * 5).toString().padStart(2, "0"),
  );

  React.useEffect(() => {
    if (onTimeChange) {
      let hourValue = parseInt(hour);
      if (period === "PM" && hourValue < 12) hourValue += 12;
      if (period === "AM" && hourValue === 12) hourValue = 0;

      const formattedHour = hourValue.toString().padStart(2, "0");
      onTimeChange(`${formattedHour}:${minute}`);
    }
  }, [hour, minute, period, onTimeChange]);

  return (
    <div className="flex flex-col space-y-4">
      <DayPicker
        showOutsideDays={showOutsideDays}
        className={cn("rounded-md border-0 bg-white p-3", className)}
        classNames={{
          months: "flex flex-col sm:flex-row gap-2",
          month: "flex flex-col gap-4",
          caption: "flex justify-center pt-1 relative items-center w-full",
          caption_label: "text-sm font-semibold text-neutral-700",
          nav: "flex items-center gap-1",
          nav_button: cn(
            buttonVariants({ variant: "outline" }),
            "size-7 bg-transparent p-0 opacity-50 hover:opacity-100 border-neutral-200 text-neutral-600",
          ),
          nav_button_previous: "absolute left-1",
          nav_button_next: "absolute right-1",
          table: "w-full border-collapse space-x-1",
          head_row: "flex",
          head_cell:
            "text-neutral-400 rounded-md w-8 font-normal text-[0.75rem] tracking-wide",
          row: "flex w-full mt-2",
          cell: cn(
            "relative p-0.5 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-primary-950 [&:has([aria-selected])]:text-white [&:has([aria-selected].day-range-end)]:rounded-r-md",
            mode === "range"
              ? "[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md"
              : "[&:has([aria-selected])]:rounded-full",
          ),
          day: cn(
            buttonVariants({ variant: "ghost" }),
            "size-8 p-0 font-normal text-neutral-700 hover:bg-neutral-100",
          ),
          day_range_start:
            "day-range-start bg-primary-900 text-white hover:bg-primary-800",
          day_range_end:
            "day-range-end bg-primary-900 text-white hover:bg-primary-800",
          day_selected:
            "bg-primary-950 text-white hover:bg-primary-900 focus:bg-primary-900 focus:text-white rounded-full",
          day_today:
            "ring-1 ring-primary-900 text-primary-900 font-semibold bg-white",
          day_outside: "text-neutral-300 opacity-70",
          day_disabled: "text-neutral-400 opacity-50 cursor-not-allowed",
          day_range_middle: "bg-neutral-100 text-neutral-800",
          day_hidden: "invisible",
          ...classNames,
        }}
        components={{
          IconLeft: ({ className, ...props }) => (
            <ChevronLeft className={cn("size-4", className)} {...props} />
          ),
          IconRight: ({ className, ...props }) => (
            <ChevronRight className={cn("size-4", className)} {...props} />
          ),
        }}
        {...props}
      />

      {mode === "datetime" && (
        <div className="px-3 pb-3">
          <div className="flex items-center space-x-2 rounded-md border bg-white p-3">
            <Clock className="size-4 text-neutral-500" />
            <div className="flex flex-1 items-center space-x-1">
              <div className="space-y-1">
                <Label htmlFor="hour" className="text-xs text-neutral-500">
                  Hour
                </Label>
                <Select value={hour} onValueChange={setHour}>
                  <SelectTrigger id="hour" className="w-16">
                    <SelectValue placeholder="Hour" />
                  </SelectTrigger>
                  <SelectContent>
                    {hours.map((h) => (
                      <SelectItem key={h} value={h}>
                        {h}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <span className="mt-6 text-xl">:</span>

              <div className="space-y-1">
                <Label htmlFor="minute" className="text-xs text-neutral-500">
                  Minute
                </Label>
                <Select value={minute} onValueChange={setMinute}>
                  <SelectTrigger id="minute" className="w-16">
                    <SelectValue placeholder="Min" />
                  </SelectTrigger>
                  <SelectContent>
                    {minutes.map((m) => (
                      <SelectItem key={m} value={m}>
                        {m}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label htmlFor="period" className="text-xs text-neutral-500">
                  AM/PM
                </Label>
                <Select value={period} onValueChange={setPeriod}>
                  <SelectTrigger id="period" className="w-16">
                    <SelectValue placeholder="AM/PM" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AM">AM</SelectItem>
                    <SelectItem value="PM">PM</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export { CalendarTimePicker };

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: React.ComponentProps<typeof DayPicker>) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("rounded-md border-0 bg-white p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row gap-2",
        month: "flex flex-col gap-4",
        caption: "flex justify-center pt-1 relative items-center w-full",
        caption_label: "text-sm font-semibold text-neutral-700",
        nav: "flex items-center gap-1",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "size-7 bg-transparent p-0 opacity-50 hover:opacity-100 border-neutral-200 text-neutral-600",
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-x-1",
        head_row: "flex",
        head_cell:
          "text-neutral-400 rounded-md w-8 font-normal text-[0.75rem] tracking-wide",
        row: "flex w-full mt-2",
        cell: cn(
          "relative p-0.5 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-primary-950 [&:has([aria-selected])]:text-white [&:has([aria-selected].day-range-end)]:rounded-r-md",
          props.mode === "range"
            ? "[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md"
            : "[&:has([aria-selected])]:rounded-full",
        ),
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "size-8 p-0 font-normal text-neutral-700 hover:bg-neutral-100",
        ),
        day_range_start:
          "day-range-start bg-primary-900 text-white hover:bg-primary-800",
        day_range_end:
          "day-range-end bg-primary-900 text-white hover:bg-primary-800",
        day_selected:
          "bg-primary-950 text-white hover:bg-primary-900 focus:bg-primary-900 focus:text-white rounded-full",
        day_today:
          "ring-1 ring-primary-900 text-primary-900 font-semibold bg-white",
        day_outside: "text-neutral-300 opacity-70",
        day_disabled: "text-neutral-400 opacity-50 cursor-not-allowed",
        day_range_middle: "bg-neutral-100 text-neutral-800",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ className, ...props }) => (
          <ChevronLeft className={cn("size-4", className)} {...props} />
        ),
        IconRight: ({ className, ...props }) => (
          <ChevronRight className={cn("size-4", className)} {...props} />
        ),
      }}
      {...props}
    />
  );
}

export { Calendar };
