import { auth } from "@/server/auth";
import { getUserAgendas } from "@/server/retrievers/calendar";
import type { FilterOptions } from "@/types";
import { NextResponse, type NextRequest } from "next/server";

export const POST = async (req: NextRequest) => {
  const session = await auth();
  const body = (await req.json()) as FilterOptions;

  try {
    const agendas = await getUserAgendas(session?.user, body);

    return NextResponse.json(agendas);
  } catch (error) {
    console.error("Error retrieving agendas:", error);
    return NextResponse.json(
      { error: "Failed to retrieve agendas" },
      { status: 500 },
    );
  }
};
