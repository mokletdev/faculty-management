import type { PaginationResult } from "@/types/pagination";
import type { Prisma } from "@prisma/client";
import { db } from "../db";

export const getAgendas = async (
  page = 1,
  pageSize = 10,
  searchQuery?: string,
): Promise<
  PaginationResult<
    Prisma.AgendaGetPayload<{
      include: {
        room: true;
        createdBy: true;
        accessDosen: true;
      };
    }>
  >
> => {
  const skip = (page - 1) * pageSize;

  const where: Prisma.AgendaWhereInput = searchQuery
    ? {
        OR: [
          { title: { contains: searchQuery, mode: "insensitive" } },
          { description: { contains: searchQuery, mode: "insensitive" } },
          { room: { name: { contains: searchQuery, mode: "insensitive" } } },
        ],
      }
    : {};

  const agendas = await db.agenda.findMany({
    where,
    include: {
      room: true,
      createdBy: true,
      accessDosen: true,
    },
    orderBy: {
      startTime: "asc",
    },
    skip,
    take: pageSize,
  });

  const totalAgendas = await db.agenda.count({ where });

  return {
    data: agendas,
    metadata: {
      totalCount: totalAgendas,
      currentPage: page,
      pageSize: pageSize,
      totalPages: Math.ceil(totalAgendas / pageSize),
    },
  };
};

export const getAgendaById = async (id: string) => {
  return db.agenda.findUnique({
    where: { id },
    include: {
      room: true,
      createdBy: true,
      accessDosen: true,
    },
  });
};

export const getRooms = async () => {
  return db.room.findMany({
    orderBy: {
      name: "asc",
    },
  });
};

export const getDosens = async () => {
  return db.user.findMany({
    where: {
      role: "DOSEN",
    },
    orderBy: {
      name: "asc",
    },
  });
};

export const getAvailableRooms = async (startTime: Date, endTime: Date) => {
  const allRooms = await db.room.findMany({
    orderBy: {
      name: "asc",
    },
  });

  const conflictingRooms = await db.agenda.findMany({
    where: {
      NOT: [{ startTime: { gte: endTime } }, { endTime: { lte: startTime } }],
    },
    select: {
      roomId: true,
    },
  });

  const conflictingRoomIds = new Set(
    conflictingRooms.map((agenda) => agenda.roomId),
  );

  const availableRooms = allRooms.filter(
    (room) => !conflictingRoomIds.has(room.id),
  );

  return availableRooms;
};
