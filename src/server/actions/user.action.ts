"use server";

import {
  createUserSchema,
  updateUserSchema,
  type BulkUserData,
  type CreateUserSchema,
  type UpdateUserSchema,
} from "@/lib/validations/user.validator";
import type { ActionResponse } from "@/types";
import { hash } from "bcryptjs";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "../db";

export async function createUser(
  data: CreateUserSchema,
): Promise<ActionResponse<{ id: string }>> {
  try {
    const validatedData = createUserSchema.parse(data);

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

    const hashedPassword = await hash(validatedData.password, 10);

    const user = await db.user.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        password: hashedPassword,
        role: validatedData.role,
        image: validatedData.image ?? null,
      },
    });

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
  data: UpdateUserSchema,
): Promise<ActionResponse<{ id: string }>> {
  try {
    const validatedData = updateUserSchema.parse(data);

    // Check if email already exists (excluding current user)
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

    // Prepare update data
    const updateData: any = {
      name: validatedData.name,
      email: validatedData.email,
      role: validatedData.role,
      image: validatedData.image ?? null,
    };

    // Only update password if provided and not empty
    if (validatedData.password && validatedData.password.length > 0) {
      updateData.password = await hash(validatedData.password, 10);
    }

    // Update user
    await db.user.update({
      where: { id },
      data: updateData,
    });

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
}> => {
  let successCount = 0;
  const failedUsers: { index: number; email: string; error: string }[] = [];

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

      await db.user.create({
        data: {
          name: user.name,
          email: user.email,
          password: hashedPassword,
          role: user.role,
          image: user.image ?? null,
        },
      });

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

  revalidatePath("/admin/user");
  return { successCount, failedUsers };
};
