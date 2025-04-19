import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getDateWithoutHours(date: Date) {
  const dateOnly = date.toISOString().split("T")[0];
  return dateOnly;
}
