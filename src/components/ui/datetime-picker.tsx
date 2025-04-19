"use client";

import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import * as React from "react";
import { useFormContext } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface DateTimePickerProps {
  name: string;
  label?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  placeholder?: string;
}

export const DateTimePicker: React.FC<DateTimePickerProps> = ({
  name,
  label,
  disabled = false,
  required = false,
  className,
  placeholder = "MM/DD/YYYY hh:mm aa",
}) => {
  const form = useFormContext();
  const [isOpen, setIsOpen] = React.useState(false);

  const fieldValue = form?.getValues(name);
  const date = fieldValue ? new Date(fieldValue) : undefined;

  const hours = Array.from({ length: 12 }, (_, i) => i + 1);

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (!selectedDate || !form) return;

    if (date) {
      selectedDate.setHours(date.getHours(), date.getMinutes());
    }

    form.setValue(name, selectedDate, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  const handleTimeChange = (
    type: "hour" | "minute" | "ampm",
    value: string,
  ) => {
    if (!date || !form) return;

    const newDate = new Date(date);

    if (type === "hour") {
      const currentAmPm = newDate.getHours() >= 12 ? 12 : 0;
      newDate.setHours((parseInt(value) % 12) + currentAmPm);
    } else if (type === "minute") {
      newDate.setMinutes(parseInt(value));
    } else if (type === "ampm") {
      const currentHour = newDate.getHours() % 12;
      newDate.setHours(value === "PM" ? currentHour + 12 : currentHour);
    }

    form.setValue(name, newDate, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  const { formState } = form || {};
  const { errors } = formState || {};
  const error = errors?.[name];

  return (
    <FormItem className={className}>
      {label && (
        <FormLabel>
          {label}
          {required && <span className="ml-1 text-red-500">*</span>}
        </FormLabel>
      )}
      <FormControl>
        <Popover open={isOpen} onOpenChange={disabled ? undefined : setIsOpen}>
          <PopoverTrigger asChild disabled={disabled}>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !date && "text-muted-foreground",
                error && "border-red-500",
                disabled && "cursor-not-allowed opacity-50",
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? (
                format(date, "MM/dd/yyyy hh:mm aa")
              ) : (
                <span>{placeholder}</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <div className="sm:flex">
              <Calendar
                mode="single"
                selected={date}
                onSelect={handleDateSelect}
                initialFocus
                disabled={disabled}
              />
              <div className="flex flex-col divide-y sm:h-[300px] sm:flex-row sm:divide-x sm:divide-y-0">
                <ScrollArea className="w-64 sm:w-auto">
                  <div className="flex p-2 sm:flex-col">
                    {hours.map((hour) => (
                      <Button
                        key={hour}
                        size="icon"
                        variant={
                          date && date.getHours() % 12 === hour % 12
                            ? "default"
                            : "ghost"
                        }
                        className="aspect-square shrink-0 sm:w-full"
                        onClick={() =>
                          handleTimeChange("hour", hour.toString())
                        }
                        disabled={disabled}
                      >
                        {hour}
                      </Button>
                    ))}
                  </div>
                  <ScrollBar orientation="horizontal" className="sm:hidden" />
                </ScrollArea>
                <ScrollArea className="w-64 sm:w-auto">
                  <div className="flex p-2 sm:flex-col">
                    {Array.from({ length: 12 }, (_, i) => i * 5).map(
                      (minute) => (
                        <Button
                          key={minute}
                          size="icon"
                          variant={
                            date && date.getMinutes() === minute
                              ? "default"
                              : "ghost"
                          }
                          className="aspect-square shrink-0 sm:w-full"
                          onClick={() =>
                            handleTimeChange(
                              "minute",
                              minute.toString().padStart(2, "0"),
                            )
                          }
                          disabled={disabled}
                        >
                          {minute.toString().padStart(2, "0")}
                        </Button>
                      ),
                    )}
                  </div>
                  <ScrollBar orientation="horizontal" className="sm:hidden" />
                </ScrollArea>
                <ScrollArea className="">
                  <div className="flex p-2 sm:flex-col">
                    {["AM", "PM"].map((ampm) => (
                      <Button
                        key={ampm}
                        size="icon"
                        variant={
                          date &&
                          ((ampm === "AM" && date.getHours() < 12) ||
                            (ampm === "PM" && date.getHours() >= 12))
                            ? "default"
                            : "ghost"
                        }
                        className="aspect-square shrink-0 sm:w-full"
                        onClick={() => handleTimeChange("ampm", ampm)}
                        disabled={disabled}
                      >
                        {ampm}
                      </Button>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </FormControl>
      <FormMessage />
    </FormItem>
  );
};
