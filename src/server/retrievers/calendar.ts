import { type Prisma, UserRole } from "@prisma/client";
import { db } from "../db";

/**
 * Retrieves agendas accessible to the currently logged-in user
 *
 * Access rules:
 * - Admins can see all agendas
 * - Users can see agendas they created
 * - Users can see agendas they have been given explicit access to via AgendaAccess
 * - Users with role DOSEN can see agendas with accessAllDosen=true
 *
 * @param userId The ID of the current logged-in user
 * @param options Optional parameters for filtering and pagination
 * @returns Promise resolving to an array of accessible agendas
 */
export const getUserAgendas = async (
  userId: string,
  options?: {
    startDate?: Date;
    endDate?: Date;
    roomId?: string;
    priority?: "LOW" | "MEDIUM" | "HIGH";
    limit?: number;
    offset?: number;
  },
) => {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const where: Prisma.AgendaWhereInput = {};

  if (options?.startDate) {
    where.startTime = { gte: options.startDate };
  }

  if (options?.endDate) {
    where.endTime = { lte: options.endDate };
  }

  if (options?.roomId) {
    where.roomId = options.roomId;
  }

  if (options?.priority) {
    where.priority = options.priority;
  }

  if (user.role !== UserRole.ADMIN) {
    // For regular users (DOSEN), apply access control
    where.OR = [
      // Agendas created by the user
      { createdById: userId },

      // Agendas the user has explicit access to
      { accessDosen: { some: { userId } } },

      // If the user is a DOSEN, they can see agendas with accessAllDosen=true
      ...(user.role === UserRole.DOSEN ? [{ accessAllDosen: true }] : []),
    ];
  }

  const agendas = await db.agenda.findMany({
    where,
    include: {
      room: true,
      createdBy: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
      accessDosen: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
        },
      },
    },
    orderBy: { startTime: "asc" },
    skip: options?.offset ?? 0,
    take: options?.limit ?? 50,
  });

  return agendas;
};

/**
 * Count total agendas accessible to the currently logged-in user
 * Uses the same access rules as getUserAgendas
 *
 * @param userId The ID of the current logged-in user
 * @param options Optional parameters for filtering
 * @returns Promise resolving to the count of accessible agendas
 */
export const countUserAgendas = async (
  userId: string,
  options?: {
    startDate?: Date;
    endDate?: Date;
    roomId?: string;
    priority?: "LOW" | "MEDIUM" | "HIGH";
  },
) => {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const where: Prisma.AgendaWhereInput = {};

  if (options?.startDate) {
    where.startTime = { gte: options.startDate };
  }

  if (options?.endDate) {
    where.endTime = { lte: options.endDate };
  }

  if (options?.roomId) {
    where.roomId = options.roomId;
  }

  if (options?.priority) {
    where.priority = options.priority;
  }

  if (user.role === UserRole.ADMIN) {
    // Admins can see all agendas, no additional filters needed
  } else {
    // For regular users (DOSEN), apply access control
    where.OR = [
      // Agendas created by the user
      { createdById: userId },

      // Agendas the user has explicit access to
      { accessDosen: { some: { userId } } },

      // If the user is a DOSEN, they can see agendas with accessAllDosen=true
      ...(user.role === UserRole.DOSEN ? [{ accessAllDosen: true }] : []),
    ];
  }

  const count = await db.agenda.count({ where });

  return count;
};

export const getGoogleCalendarId = async () => {
  const googleCalendarShareable = await db.googleCalendarShareable.findFirst();

  if (!googleCalendarShareable)
    throw new Error(
      "Google Calendar Shareable is not initialized! Seed it first.",
    );

  return googleCalendarShareable.calendarId;
};

export const getShareableCalendarUrl = (calendarId: string) => {
  return `https://calendar.google.com/calendar/u/0/r?cid=${calendarId}`;
};
