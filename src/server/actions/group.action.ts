"use server";

import type { ActionResponse } from "@/types";
import { revalidatePath } from "next/cache";
import { db } from "../db";

export const saveGroupEmail = async (
  groupEmail: string,
): Promise<ActionResponse<{ success: boolean }>> => {
  try {
    const existingGroup = await db.googleGroupShareable.findFirst();

    if (existingGroup) {
      await db.googleGroupShareable.update({
        where: { groupEmail: existingGroup.groupEmail },
        data: { groupEmail },
      });
    } else {
      await db.googleGroupShareable.create({
        data: { groupEmail },
      });
    }

    revalidatePath("/admin/group-settings");
    return { data: { success: true } };
  } catch (error) {
    console.error("Error saving group email:", error);
    return {
      error: {
        message: "Gagal menyimpan Google Group Email",
        code: "INTERNAL_ERROR",
      },
    };
  }
};
