"use server";

import type { ActionResponse } from "@/types";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "../db";

const roomSchema = z.object({
  name: z.string().min(1, { message: "Nama ruangan wajib diisi" }),
  location: z.string().optional(),
});

export type RoomSchema = z.infer<typeof roomSchema>;

export async function createRoom(
  data: RoomSchema,
): Promise<ActionResponse<{ id: string }>> {
  try {
    const validatedData = roomSchema.parse(data);

    // Check if a room with the same name already exists
    const existingRoom = await db.room.findFirst({
      where: { name: validatedData.name },
    });

    if (existingRoom) {
      return {
        error: {
          message: "Ruangan dengan nama tersebut sudah ada",
          code: "ROOM_EXISTS",
          fieldErrors: { name: ["Ruangan dengan nama tersebut sudah ada"] },
        },
      };
    }

    const room = await db.room.create({
      data: {
        name: validatedData.name,
        location: validatedData.location ?? null,
      },
    });

    revalidatePath("/admin/room");
    return { data: { id: room.id } };
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

    console.error("Error creating room:", error);
    return {
      error: {
        message: "Gagal membuat ruangan",
        code: "INTERNAL_ERROR",
      },
    };
  }
}

export async function updateRoom(
  id: string,
  data: RoomSchema,
): Promise<ActionResponse<{ id: string }>> {
  try {
    const validatedData = roomSchema.parse(data);

    // Check if room exists
    const existingRoom = await db.room.findUnique({
      where: { id },
    });

    if (!existingRoom) {
      return {
        error: {
          message: "Ruangan tidak ditemukan",
          code: "ROOM_NOT_FOUND",
        },
      };
    }

    // Check if name is being changed and if it conflicts with another room
    if (validatedData.name !== existingRoom.name) {
      const nameConflict = await db.room.findFirst({
        where: {
          name: validatedData.name,
          id: { not: id },
        },
      });

      if (nameConflict) {
        return {
          error: {
            message: "Ruangan dengan nama tersebut sudah ada",
            code: "ROOM_EXISTS",
            fieldErrors: { name: ["Ruangan dengan nama tersebut sudah ada"] },
          },
        };
      }
    }

    const updatedRoom = await db.room.update({
      where: { id },
      data: {
        name: validatedData.name,
        location: validatedData.location ?? null,
      },
    });

    revalidatePath("/admin/room");
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

    console.error("Error updating room:", error);
    return {
      error: {
        message: "Gagal memperbarui ruangan",
        code: "INTERNAL_ERROR",
      },
    };
  }
}

export async function deleteRoom(
  id: string,
): Promise<ActionResponse<{ success: boolean }>> {
  try {
    // Check if room exists
    const room = await db.room.findUnique({
      where: { id },
      include: {
        agendas: {
          select: { id: true },
          take: 1,
        },
      },
    });

    if (!room) {
      return {
        error: {
          message: "Ruangan tidak ditemukan",
          code: "ROOM_NOT_FOUND",
        },
      };
    }

    // Delete room and all its related agendas
    await db.room.delete({
      where: { id },
    });

    revalidatePath("/admin/room");
    return { data: { success: true } };
  } catch (error) {
    console.error("Error deleting room:", error);
    return {
      error: {
        message: "Gagal menghapus ruangan",
        code: "INTERNAL_ERROR",
      },
    };
  }
}

export async function getRooms(): Promise<
  ActionResponse<{
    rooms: Array<{
      id: string;
      name: string;
      location: string | null;
    }>;
  }>
> {
  try {
    const rooms = await db.room.findMany({
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        location: true,
      },
    });

    return { data: { rooms } };
  } catch (error) {
    console.error("Error fetching rooms:", error);
    return {
      error: {
        message: "Gagal mengambil data ruangan",
        code: "INTERNAL_ERROR",
      },
    };
  }
}
