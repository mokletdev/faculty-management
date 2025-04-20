"use server";

import { ActionError, handleActionError } from "@/lib/exceptions";
import { agendaSchema, type AgendaSchema } from "@/lib/validations/agenda";
import type { Agenda } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { auth } from "../auth";
import { db } from "../db";
import {
  createGoogleCalendarEvent,
  deleteGoogleCalendarEvent,
  updateGoogleCalendarEvent,
} from "./google-calendar";

export type AgendaResponse<T> = {
  data?: T;
  error?: {
    message: string;
    code: string;
    fieldErrors?: Record<string, string[]>;
  };
};

export const createAgenda = async (
  formData: AgendaSchema,
): Promise<AgendaResponse<Agenda>> => {
  try {
    const validatedFields = agendaSchema.parse(formData);

    const session = await auth();

    if (!session) {
      throw new ActionError("Unauthorized access", "UNAUTHORIZED");
    }

    const conflictingAgenda = await db.agenda.findFirst({
      where: {
        roomId: validatedFields.roomId,
        NOT: [
          { startTime: { gte: new Date(validatedFields.endTime) } },
          { endTime: { lte: new Date(validatedFields.startTime) } },
        ],
      },
    });

    if (conflictingAgenda) {
      throw new ActionError(
        "There is a scheduling conflict with another agenda in this room",
        "CONFLICT",
      );
    }

    const agenda = await db.agenda.create({
      data: {
        title: validatedFields.title,
        description: validatedFields.description,
        startTime: new Date(validatedFields.startTime),
        endTime: new Date(validatedFields.endTime),
        priority: validatedFields.priority,
        roomId: validatedFields.roomId,
        createdById: session.user.id,
        accessMahasiswa: validatedFields.accessMahasiswa,
        accessAllDosen: validatedFields.accessAllDosen,
      },
      include: {
        room: {
          select: {
            name: true,
            location: true,
          },
        },
      },
    });

    if (
      !validatedFields.accessAllDosen &&
      validatedFields.accessDosen &&
      validatedFields.accessDosen.length > 0
    ) {
      await db.agendaAccess.createMany({
        data: validatedFields.accessDosen.map((userId) => ({
          agendaId: agenda.id,
          userId,
        })),
      });
    }

    await createGoogleCalendarEvent(agenda);
    await createNotifications(agenda.id, "CREATED");

    revalidatePath("/", "layout");
    return { data: agenda };
  } catch (error) {
    return handleActionError(error);
  }
};

export const updateAgenda = async (
  id: string,
  formData: AgendaSchema,
): Promise<AgendaResponse<Agenda>> => {
  try {
    const validatedFields = agendaSchema.parse(formData);

    const session = await auth();
    if (!session) {
      throw new ActionError("Unauthorized access", "UNAUTHORIZED");
    }

    const existingAgenda = await db.agenda.findUnique({ where: { id } });
    if (!existingAgenda) {
      throw new ActionError("Agenda not found", "NOT_FOUND");
    }

    const conflictingAgenda = await db.agenda.findFirst({
      where: {
        roomId: validatedFields.roomId,
        id: { not: id },
        NOT: [
          { startTime: { gte: new Date(validatedFields.endTime) } },
          { endTime: { lte: new Date(validatedFields.startTime) } },
        ],
      },
    });

    if (conflictingAgenda) {
      throw new ActionError(
        "There is a scheduling conflict with another agenda in this room",
        "CONFLICT",
      );
    }

    const agenda = await db.agenda.update({
      where: { id },
      data: {
        title: validatedFields.title,
        description: validatedFields.description,
        startTime: new Date(validatedFields.startTime),
        endTime: new Date(validatedFields.endTime),
        priority: validatedFields.priority,
        roomId: validatedFields.roomId,
        accessMahasiswa: validatedFields.accessMahasiswa,
        accessAllDosen: validatedFields.accessAllDosen,
      },
      include: {
        room: {
          select: { name: true, location: true },
        },
      },
    });

    if (
      !validatedFields.accessAllDosen &&
      validatedFields.accessDosen !== undefined
    ) {
      const existingAccess = await db.agendaAccess.findMany({
        where: { agendaId: id },
        select: { userId: true },
      });
      const existingUserIds = existingAccess.map((a) => a.userId);

      const toAdd = validatedFields.accessDosen.filter(
        (userId) => !existingUserIds.includes(userId),
      );
      const toRemove = existingUserIds.filter(
        (userId) => !validatedFields.accessDosen!.includes(userId),
      );

      if (toRemove.length > 0) {
        await db.agendaAccess.deleteMany({
          where: {
            agendaId: id,
            userId: { in: toRemove },
          },
        });
      }

      if (toAdd.length > 0) {
        await db.agendaAccess.createMany({
          data: toAdd.map((userId) => ({
            agendaId: agenda.id,
            userId,
          })),
        });
      }
    } else if (validatedFields.accessAllDosen) {
      await db.agendaAccess.deleteMany({
        where: { agendaId: id },
      });
    }

    await updateGoogleCalendarEvent(agenda);
    await createNotifications(agenda.id, "UPDATED");

    revalidatePath("/", "layout");
    return { data: agenda };
  } catch (error) {
    return handleActionError(error);
  }
};

export async function deleteAgenda(
  id: string,
): Promise<AgendaResponse<Agenda>> {
  try {
    const session = await auth();
    if (!session) {
      throw new ActionError("Unauthorized access", "UNAUTHORIZED");
    }

    const existingAgenda = await db.agenda.findUnique({
      where: { id },
      include: { room: { select: { name: true, location: true } } },
    });
    if (!existingAgenda) {
      throw new ActionError("Agenda not found", "NOT_FOUND");
    }

    await deleteGoogleCalendarEvent(existingAgenda);

    await db.agendaAccess.deleteMany({
      where: { agendaId: id },
    });

    await db.notification.deleteMany({
      where: { agendaId: id },
    });

    await createNotifications(id, "CANCELLED");

    await db.agenda.delete({
      where: { id },
    });

    revalidatePath("/", "layout");
    return { data: existingAgenda };
  } catch (error) {
    return handleActionError(error);
  }
}

const createNotifications = async (
  agendaId: string,
  type: "CREATED" | "UPDATED" | "CANCELLED",
) => {
  const agenda = await db.agenda.findUnique({
    where: { id: agendaId },
    include: {
      room: true,
      accessDosen: true,
    },
  });

  if (!agenda) return;

  // Determine which users should be notified
  let userIds: string[] = [];

  if (agenda.accessAllDosen) {
    // Notify all dosen
    const allDosen = await db.user.findMany({
      where: { role: "DOSEN" },
      select: { id: true },
    });
    userIds = allDosen.map((user) => user.id);
  } else {
    // Notify only specific dosen with access
    userIds = agenda.accessDosen.map((access) => access.userId);
  }

  let message = "";
  switch (type) {
    case "CREATED":
      message = `Agenda baru "${agenda.title}" di ${agenda.room.name} pada ${agenda.startTime.toLocaleDateString()} berhasil dibuat`;
      break;
    case "UPDATED":
      message = `Agenda "${agenda.title}" di ${agenda.room.name} pada ${agenda.startTime.toLocaleDateString()} berhasil diperbarui`;
      break;
    case "CANCELLED":
      message = `Agenda "${agenda.title}" telah dibatalkan`;
      break;
  }

  // TODO: Blast email to users

  if (userIds.length > 0) {
    const batchSize = 100;

    for (let i = 0; i < userIds.length; i += batchSize) {
      const batch = userIds.slice(i, i + batchSize);
      await db.notification.createMany({
        data: batch.map((userId) => ({
          type,
          message,
          userId,
          agendaId: type === "CANCELLED" ? null : agendaId,
        })),
      });
    }
  }
};
