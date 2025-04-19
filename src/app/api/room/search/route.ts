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

  if (start === null || end === null) {
    console.error("start and end is required.");
    return NextResponse.json(
      { error: "start and end is required." },
      { status: 400 },
    );
  }

  const startTime = new Date(start);
  const endTime = new Date(end);

  if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
    console.error("start and end is invalid.");
    return NextResponse.json(
      { error: "start and end is invalid." },
      { status: 400 },
    );
  }

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

    const conflictingRooms = await db.agenda.findMany({
      where: {
        NOT: [{ startTime: { gte: endTime } }, { endTime: { lte: startTime } }],
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
  } catch (error) {
    console.error("Error searching rooms:", error);
    return NextResponse.json(
      { error: "Failed to search rooms" },
      { status: 500 },
    );
  }
}
