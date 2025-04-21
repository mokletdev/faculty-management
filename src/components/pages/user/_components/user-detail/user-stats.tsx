import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/server/db";
import { CalendarClock, Clock, Users } from "lucide-react";

interface UserStatsProps {
  userId: string;
  className?: string;
}

export async function UserStats({ userId, className }: UserStatsProps) {
  const [agendaCount, accessCount, notificationCount] = await db.$transaction([
    db.agenda.count({
      where: {
        createdById: userId,
      },
    }),
    db.agendaAccess.count({
      where: {
        userId,
      },
    }),
    db.notification.count({
      where: {
        userId,
      },
    }),
  ]);

  const upcomingAgenda = await db.agenda.findFirst({
    where: {
      OR: [
        { createdById: userId },
        {
          accessDosen: {
            some: {
              userId,
            },
          },
        },
      ],
      startTime: {
        gte: new Date(),
      },
    },
    orderBy: {
      startTime: "asc",
    },
    select: {
      startTime: true,
    },
  });

  const stats = [
    {
      title: "Agenda Dibuat",
      value: agendaCount,
      icon: CalendarClock,
    },
    {
      title: "Akses Agenda",
      value: accessCount,
      icon: Users,
    },
    {
      title: "Notifikasi",
      value: notificationCount,
      icon: Clock,
    },
  ];

  return (
    <div className={className}>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Statistik</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats.map((stat) => (
              <div key={stat.title} className="flex items-center">
                <div className="bg-muted mr-4 flex h-10 w-10 items-center justify-center rounded-full">
                  <stat.icon className="text-muted-foreground h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm leading-none font-medium">
                    {stat.title}
                  </p>
                  <p className="text-muted-foreground text-sm">{stat.value}</p>
                </div>
              </div>
            ))}

            {upcomingAgenda && (
              <div className="bg-muted mt-6 rounded-md p-3">
                <div className="text-sm font-medium">Agenda Berikutnya</div>
                <div className="text-muted-foreground text-xs">
                  {new Date(upcomingAgenda.startTime).toLocaleDateString(
                    "id-ID",
                    {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    },
                  )}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
