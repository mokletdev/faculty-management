"use server";

import {
  updateUserSchema,
  userSchema,
  type BulkUserData,
  type UserSchema,
} from "@/lib/validations/user.validator";
import type { ActionResponse } from "@/types";
import { hash } from "bcryptjs";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "../db";
import {
  addUserToGoogleGroup,
  batchAddUsersToGoogleGroup,
  removeUserFromGoogleGroup,
} from "./google-groups.action";

// Add this new function to check if Google Group integration is enabled
const isGoogleGroupEnabled = async (): Promise<boolean> => {
  try {
    const group = await db.googleGroupShareable.findFirst();
    return !!group;
  } catch (error) {
    console.error("Error checking Google Group status:", error);
    return false;
  }
};

export async function createUser(
  data: UserSchema,
): Promise<ActionResponse<{ id: string }>> {
  try {
    const validatedData = userSchema.parse(data);

    const existingUser = await db.user.findUnique({
      where: { email: validatedData.email },
    });

    if (existingUser) {
      return {
        error: {
          message: "Email sudah terdaftar",
          code: "EMAIL_EXISTS",
          fieldErrors: { email: ["Email sudah terdaftar"] },
        },
      };
    }

    const hashedPassword = validatedData.password
      ? await hash(validatedData.password, 10)
      : null;

    const user = await db.user.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        password: hashedPassword,
        role: validatedData.role,
        image: validatedData.image ?? null,
      },
    });

    const googleGroupEnabled = await isGoogleGroupEnabled();
    if (googleGroupEnabled) {
      try {
        await addUserToGoogleGroup(user);
      } catch (error) {
        console.error(
          `Failed to add user ${user.email} to Google Group:`,
          error,
        );
      }
    }

    revalidatePath("/admin/user");
    return { data: { id: user.id } };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        error: {
          message: "Validasi gagal",
          code: "VALIDATION_ERROR",
          fieldErrors: error.flatten().fieldErrors as Record<string, any>,
        },
      };
    }

    console.error("Error creating user:", error);
    return {
      error: {
        message: "Gagal membuat pengguna",
        code: "INTERNAL_ERROR",
      },
    };
  }
}

export async function updateUser(
  id: string,
  data: UserSchema,
): Promise<ActionResponse<{ id: string }>> {
  try {
    const validatedData = updateUserSchema.parse(data);

    const originalUser = await db.user.findUnique({
      where: { id },
    });

    if (!originalUser) {
      return {
        error: {
          message: "Pengguna tidak ditemukan",
          code: "USER_NOT_FOUND",
        },
      };
    }

    if (validatedData.email !== originalUser.email) {
      const existingUser = await db.user.findFirst({
        where: {
          email: validatedData.email,
          id: { not: id },
        },
      });

      if (existingUser) {
        return {
          error: {
            message: "Email sudah terdaftar",
            code: "EMAIL_EXISTS",
            fieldErrors: { email: ["Email sudah terdaftar"] },
          },
        };
      }
    }

    const updateData: any = {
      name: validatedData.name,
      email: validatedData.email,
      role: validatedData.role,
      image: validatedData.image ?? null,
    };

    if (validatedData.password && validatedData.password.length > 0) {
      updateData.password = await hash(validatedData.password, 10);
    }

    const updatedUser = await db.user.update({
      where: { id },
      data: updateData,
    });

    // Handle Google Group membership if email changed
    const googleGroupEnabled = await isGoogleGroupEnabled();
    if (googleGroupEnabled && originalUser.email !== updatedUser.email) {
      try {
        // Remove with old email and add with new email
        if (originalUser.email) {
          await removeUserFromGoogleGroup({
            ...originalUser,
            email: originalUser.email,
          });
        }
        await addUserToGoogleGroup(updatedUser);
      } catch (error) {
        console.error(
          `Failed to update user ${updatedUser.email} in Google Group:`,
          error,
        );
      }
    }

    revalidatePath("/admin/user");
    return { data: { id } };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        error: {
          message: "Validasi gagal",
          code: "VALIDATION_ERROR",
          fieldErrors: error.flatten().fieldErrors as Record<string, any>,
        },
      };
    }

    console.error("Error updating user:", error);
    return {
      error: {
        message: "Gagal memperbarui pengguna",
        code: "INTERNAL_ERROR",
      },
    };
  }
}

export async function deleteUser(
  id: string,
): Promise<ActionResponse<{ success: boolean }>> {
  try {
    const user = await db.user.findUnique({
      where: { id },
      include: {
        createdAgendas: { select: { id: true }, take: 1 },
        agendaAccesses: { select: { id: true }, take: 1 },
      },
    });

    if (!user) {
      return {
        error: {
          message: "Pengguna tidak ditemukan",
          code: "USER_NOT_FOUND",
        },
      };
    }

    if (user.createdAgendas.length > 0 || user.agendaAccesses.length > 0) {
      return {
        error: {
          message: "Pengguna tidak dapat dihapus karena memiliki data terkait",
          code: "USER_HAS_RELATED_DATA",
        },
      };
    }

    // Remove user from Google Group if enabled
    const googleGroupEnabled = await isGoogleGroupEnabled();
    if (googleGroupEnabled && user.email) {
      try {
        await removeUserFromGoogleGroup(user);
      } catch (error) {
        console.error(
          `Failed to remove user ${user.email} from Google Group:`,
          error,
        );
        // We continue without failing the whole operation
      }
    }

    await db.user.delete({
      where: { id },
    });

    revalidatePath("/admin/user");
    return { data: { success: true } };
  } catch (error) {
    console.error("Error deleting user:", error);
    return {
      error: {
        message: "Gagal menghapus pengguna",
        code: "INTERNAL_ERROR",
      },
    };
  }
}

export const bulkCreateUsers = async (
  users: BulkUserData[],
  lastIndex?: number,
): Promise<{
  successCount: number;
  failedUsers: { index: number; email: string; error: string }[];
  groupSuccessCount?: number;
  groupFailedCount?: number;
}> => {
  let successCount = 0;
  const failedUsers: { index: number; email: string; error: string }[] = [];
  const createdUsers: any[] = [];

  for (let i = 0; i < users.length; i++) {
    const user = users[i]!;

    try {
      const existingUser = await db.user.findUnique({
        where: { email: user.email },
      });

      if (existingUser) {
        failedUsers.push({
          index: lastIndex ? i + lastIndex : i,
          email: user.email,
          error: "Email sudah terdaftar",
        });
        continue;
      }

      const hashedPassword = await hash(user.password, 10);

      const createdUser = await db.user.create({
        data: {
          name: user.name,
          email: user.email,
          password: hashedPassword,
          role: user.role,
          image: user.image ?? null,
        },
      });

      createdUsers.push(createdUser);
      successCount++;
    } catch (error) {
      console.error(`Error creating user ${user.email}:`, error);
      failedUsers.push({
        index: lastIndex ? i + lastIndex : i,
        email: user.email,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  // Add users to Google Group if enabled
  let groupSuccessCount = 0;
  let groupFailedCount = 0;

  const googleGroupEnabled = await isGoogleGroupEnabled();
  if (googleGroupEnabled && createdUsers.length > 0) {
    try {
      const result = await batchAddUsersToGoogleGroup(createdUsers);
      groupSuccessCount = result.successCount;
      groupFailedCount = result.failedUsers.length;
    } catch (error) {
      console.error("Failed to add users to Google Group in bulk:", error);
      // Group operations failed, but user creation was successful
    }
  }

  revalidatePath("/admin/user");
  return {
    successCount,
    failedUsers,
    groupSuccessCount,
    groupFailedCount,
  };
};
