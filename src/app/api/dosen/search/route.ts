import { auth } from "@/server/auth";
import { db } from "@/server/db";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") ?? "";
  const session = await auth();

  if (session?.user.role !== "ADMIN") {
    console.error("User not authenticated");
    return NextResponse.json(
      { error: "User is unauthorized." },
      { status: 500 },
    );
  }

  try {
    const dosens = await db.user.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { email: { contains: query, mode: "insensitive" } },
        ],
        role: "DOSEN",
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
      take: 10,
    });

    return NextResponse.json(dosens);
  } catch (error) {
    console.error("Error searching dosens:", error);
    return NextResponse.json(
      { error: "Failed to search dosens" },
      { status: 500 },
    );
  }
}
