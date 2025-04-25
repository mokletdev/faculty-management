import type { PaginationResult } from "@/types/pagination";
import type { Prisma } from "@prisma/client";
import { db } from "../db";

export const getRooms = async (
  page = 1,
  pageSize = 10,
  searchQuery?: string,
): Promise<
  PaginationResult<
    Prisma.RoomGetPayload<{
      select: {
        id: true;
        name: true;
        location: true;
        createdAt: true;
        updatedAt: true;
        _count: {
          select: {
            agendas: true;
          };
        };
      };
    }>
  >
> => {
  const skip = (page - 1) * pageSize;

  const where: Prisma.RoomWhereInput = {};

  if (searchQuery) {
    where.OR = [
      { name: { contains: searchQuery, mode: "insensitive" } },
      { location: { contains: searchQuery, mode: "insensitive" } },
    ];
  }

  const rooms = await db.room.findMany({
    where,
    select: {
      id: true,
      name: true,
      location: true,
      createdAt: true,
      updatedAt: true,
      _count: {
        select: {
          agendas: true,
        },
      },
    },
    orderBy: {
      name: "asc",
    },
    skip,
    take: pageSize,
  });

  const totalRooms = await db.room.count({ where });

  return {
    data: rooms,
    metadata: {
      totalCount: totalRooms,
      currentPage: page,
      pageSize: pageSize,
      totalPages: Math.ceil(totalRooms / pageSize),
    },
  };
};

export const getRoomById = async (id: string) => {
  return db.room.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      location: true,
      createdAt: true,
      updatedAt: true,
      agendas: {
        select: {
          id: true,
          title: true,
          startTime: true,
          endTime: true,
          createdBy: {
            select: {
              name: true,
            },
          },
        },
        take: 5,
        orderBy: {
          startTime: "desc",
        },
      },
    },
  });
};

export const getRoomsByLocation = async (
  location: string,
  page = 1,
  pageSize = 10,
): Promise<
  PaginationResult<
    Prisma.RoomGetPayload<{
      select: { id: true; name: true; location: true };
    }>
  >
> => {
  const skip = (page - 1) * pageSize;

  const where: Prisma.RoomWhereInput = {
    location: { contains: location, mode: "insensitive" },
  };

  const rooms = await db.room.findMany({
    where,
    select: {
      id: true,
      name: true,
      location: true,
    },
    orderBy: {
      name: "asc",
    },
    skip,
    take: pageSize,
  });

  const totalRooms = await db.room.count({ where });

  return {
    data: rooms,
    metadata: {
      totalCount: totalRooms,
      currentPage: page,
      pageSize: pageSize,
      totalPages: Math.ceil(totalRooms / pageSize),
    },
  };
};
