"use server";

import type { ActionResponse } from "@/types";
import { revalidatePath } from "next/cache";
import { db } from "../db";

export const saveCalendarId = async (
  calendarId: string,
): Promise<ActionResponse<{ success: boolean }>> => {
  try {
    const existingCalendar = await db.googleCalendarShareable.findFirst();

    if (existingCalendar) {
      await db.googleCalendarShareable.update({
        where: { calendarId: existingCalendar.calendarId },
        data: { calendarId },
      });
    } else {
      await db.googleCalendarShareable.create({
        data: { calendarId },
      });
    }

    revalidatePath("/admin/calendar-settings");
    return { data: { success: true } };
  } catch (error) {
    console.error("Error saving calendar ID:", error);
    return {
      error: {
        message: "Gagal menyimpan ID Calendar",
        code: "INTERNAL_ERROR",
      },
    };
  }
};
