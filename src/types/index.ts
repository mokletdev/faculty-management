import type { Priority, Prisma } from "@prisma/client";

export type AgendaWithRoom = Prisma.AgendaGetPayload<{
  include: {
    room: true;
    createdBy: {
      select: {
        id: true;
        name: true;
        email: true;
        image: true;
      };
    };
    accessDosen: {
      include: {
        user: {
          select: {
            id: true;
            name: true;
            email: true;
            image: true;
          };
        };
      };
    };
  };
}>;

export type FilterOptions = {
  startDate?: Date;
  endDate?: Date;
  roomId?: string;
  priority?: Priority;
  limit?: number;
  offset?: number;
};

export type RoomSearchResult = {
  id: string;
  name: string;
};
