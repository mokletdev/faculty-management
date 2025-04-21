import type { PaginationResult } from "@/types/pagination";
import type { Prisma, UserRole } from "@prisma/client";
import { db } from "../db";

export const getUsers = async (
  page = 1,
  pageSize = 10,
  searchQuery?: string,
  role?: UserRole,
): Promise<
  PaginationResult<
    Prisma.UserGetPayload<{
      select: {
        id: true;
        name: true;
        email: true;
        image: true;
        role: true;
      };
    }>
  >
> => {
  const skip = (page - 1) * pageSize;

  const where: Prisma.UserWhereInput = {};

  if (searchQuery) {
    where.OR = [
      { name: { contains: searchQuery, mode: "insensitive" } },
      { email: { contains: searchQuery, mode: "insensitive" } },
    ];
  }

  if (role) {
    where.role = role;
  }

  const users = await db.user.findMany({
    where,
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      role: true,
    },
    orderBy: {
      name: "asc",
    },
    skip,
    take: pageSize,
  });

  const totalUsers = await db.user.count({ where });

  return {
    data: users,
    metadata: {
      totalCount: totalUsers,
      currentPage: page,
      pageSize: pageSize,
      totalPages: Math.ceil(totalUsers / pageSize),
    },
  };
};

export const getUserById = async (id: string) => {
  return db.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      role: true,
      createdAgendas: {
        select: {
          id: true,
          title: true,
          startTime: true,
          endTime: true,
          room: {
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
      agendaAccesses: {
        select: {
          agenda: {
            select: {
              id: true,
              title: true,
              startTime: true,
              endTime: true,
              room: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
        take: 5,
        orderBy: {
          agenda: {
            startTime: "desc",
          },
        },
      },
    },
  });
};

export const getUsersByRole = async (
  role: UserRole,
  page = 1,
  pageSize = 10,
  searchQuery?: string,
): Promise<
  PaginationResult<
    Prisma.UserGetPayload<{
      select: { id: true; name: true; email: true; image: true };
    }>
  >
> => {
  return getUsers(page, pageSize, searchQuery, role);
};

export const getDosens = async (
  page = 1,
  pageSize = 10,
  searchQuery?: string,
): Promise<
  PaginationResult<
    Prisma.UserGetPayload<{
      select: { id: true; name: true; email: true; image: true };
    }>
  >
> => {
  return getUsersByRole("DOSEN", page, pageSize, searchQuery);
};

export const getAdmins = async (
  page = 1,
  pageSize = 10,
  searchQuery?: string,
): Promise<
  PaginationResult<
    Prisma.UserGetPayload<{
      select: { id: true; name: true; email: true; image: true };
    }>
  >
> => {
  return getUsersByRole("ADMIN", page, pageSize, searchQuery);
};
