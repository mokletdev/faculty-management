import { auth } from "@/server/auth";
import { db } from "@/server/db";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") ?? "";
  const start = searchParams.get("start");
  const end = searchParams.get("end");

  const session = await auth();

  if (session?.user.role !== "ADMIN") {
    console.error("User not authenticated");
    return NextResponse.json(
      { error: "User is unauthorized." },
      { status: 403 },
    );
  }

  const startTime = start ? new Date(start) : null;
  const endTime = end ? new Date(end) : null;

  try {
    const rooms = await db.room.findMany({
      where: {
        name: { contains: query, mode: "insensitive" },
      },
      select: {
        id: true,
        name: true,
      },
      take: 10,
    });

    if (startTime && endTime) {
      if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
        console.error("start and end is invalid.");
        return NextResponse.json(
          { error: "start and end is invalid." },
          { status: 400 },
        );
      }

      const conflictingRooms = await db.agenda.findMany({
        where: {
          NOT: [
            { startTime: { gte: endTime } },
            { endTime: { lte: startTime } },
          ],
        },
        select: {
          roomId: true,
        },
      });

      return NextResponse.json(
        rooms.filter(
          (room) => !conflictingRooms.find(({ roomId }) => roomId === room.id),
        ),
      );
    }

    return NextResponse.json(rooms);
  } catch (error) {
    console.error("Error searching rooms:", error);
    return NextResponse.json(
      { error: "Failed to search rooms" },
      { status: 500 },
    );
  }
}
