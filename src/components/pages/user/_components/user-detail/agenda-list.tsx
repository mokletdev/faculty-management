import { Badge } from "@/components/ui/badge";
import { cn, formatDate } from "@/lib/utils";
import { db } from "@/server/db";
import type { Priority } from "@prisma/client";
import Link from "next/link";

interface AgendaListProps {
  userId: string;
  type: "created" | "access";
  limit?: number;
}

export async function AgendaList({ userId, type, limit = 5 }: AgendaListProps) {
  const agendas = await (type === "created"
    ? db.agenda.findMany({
        where: {
          createdById: userId,
        },
        select: {
          id: true,
          title: true,
          startTime: true,
          endTime: true,
          priority: true,
          room: {
            select: {
              name: true,
            },
          },
        },
        orderBy: {
          startTime: "desc",
        },
        take: limit,
      })
    : db.agendaAccess.findMany({
        where: {
          userId,
        },
        select: {
          agenda: {
            select: {
              id: true,
              title: true,
              startTime: true,
              endTime: true,
              priority: true,
              room: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
        orderBy: {
          agenda: {
            startTime: "desc",
          },
        },
        take: limit,
      }));

  const formattedAgendas =
    type === "created"
      ? agendas
      : agendas.map((access) => (access as any).agenda);

  if (formattedAgendas.length === 0) {
    return (
      <div className="flex h-32 items-center justify-center rounded-md border border-dashed">
        <p className="text-muted-foreground text-sm">
          Tidak ada agenda yang {type === "created" ? "dibuat" : "diakses"}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {formattedAgendas.map((agenda) => (
        <Link
          key={agenda.id}
          href={`/admin/calendar?date=${agenda.startTime.toISOString()}`}
          className="hover:bg-muted/50 block rounded-lg border p-4 transition-colors"
        >
          <div className="flex items-start justify-between">
            <div>
              <h4 className="font-medium">{agenda.title}</h4>
              <p className="text-muted-foreground mt-1 text-sm">
                {formatDate(new Date(agenda.startTime))} -{" "}
                {formatDate(new Date(agenda.endTime))}
              </p>
              <p className="text-muted-foreground mt-1 text-sm">
                Ruangan: {agenda.room.name}
              </p>
            </div>
            <PriorityBadge priority={agenda.priority} />
          </div>
        </Link>
      ))}
    </div>
  );
}

function PriorityBadge({ priority }: { priority: Priority }) {
  return (
    <Badge
      variant={
        priority === "HIGH"
          ? "destructive"
          : priority === "MEDIUM"
            ? "default"
            : "outline"
      }
      className={cn(
        "capitalize",
        priority === "LOW" && "border-primary-500 text-primary-500",
      )}
    >
      {priority.toLowerCase()}
    </Badge>
  );
}
