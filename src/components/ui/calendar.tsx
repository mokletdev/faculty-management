"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import * as React from "react";
import { DayPicker } from "react-day-picker";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
          "relative p-0.5 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-primary-800 [&:has([aria-selected])]:text-white [&:has([aria-selected].day-range-end)]:rounded-r-md",
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
          "bg-primary-800 text-white hover:bg-primary-900 rounded-full",
        day_today:
          "ring-1 ring-primary-900 text-primary-900 font-semibold text-black",
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
