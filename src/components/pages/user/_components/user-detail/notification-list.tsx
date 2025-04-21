import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { db } from "@/server/db";
import type { NotificationType } from "@prisma/client";
import { Bell, CalendarCheck, CalendarX, RefreshCw } from "lucide-react";
import Link from "next/link";

interface NotificationListProps {
  userId: string;
  limit?: number;
}

export async function NotificationList({
  userId,
  limit = 10,
}: NotificationListProps) {
  const notifications = await db.notification.findMany({
    where: {
      userId,
    },
    select: {
      id: true,
      type: true,
      message: true,
      isRead: true,
      createdAt: true,
      agenda: {
        select: {
          id: true,
          startTime: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: limit,
  });

  if (notifications.length === 0) {
    return (
      <div className="flex h-32 items-center justify-center rounded-md border border-dashed">
        <p className="text-muted-foreground text-sm">Tidak ada notifikasi</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`rounded-lg border p-4 ${notification.isRead ? "" : "bg-muted/50"}`}
        >
          <div className="flex items-start gap-3">
            <div className="mt-0.5">
              <NotificationIcon type={notification.type} />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">
                  <NotificationTitle type={notification.type} />
                </h4>
                <span className="text-muted-foreground text-xs">
                  {formatDate(new Date(notification.createdAt))}
                </span>
              </div>
              <p className="mt-1 text-sm">{notification.message}</p>
              {notification.agenda && (
                <div className="mt-2">
                  <Link
                    href={`/admin/calendar?date=${notification.agenda.startTime.toISOString()}`}
                    className="text-primary text-xs hover:underline"
                  >
                    Lihat Agenda
                  </Link>
                </div>
              )}
            </div>
            {!notification.isRead && (
              <Badge
                variant="secondary"
                className="ml-2 h-2 w-2 rounded-full p-0"
              />
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function NotificationIcon({ type }: { type: NotificationType }) {
  switch (type) {
    case "CREATED":
      return <CalendarCheck className="h-5 w-5 text-green-500" />;
    case "UPDATED":
      return <RefreshCw className="h-5 w-5 text-blue-500" />;
    case "CANCELLED":
      return <CalendarX className="h-5 w-5 text-red-500" />;
    default:
      return <Bell className="h-5 w-5 text-gray-500" />;
  }
}

function NotificationTitle({ type }: { type: NotificationType }) {
  switch (type) {
    case "CREATED":
      return "Agenda Dibuat";
    case "UPDATED":
      return "Agenda Diperbarui";
    case "CANCELLED":
      return "Agenda Dibatalkan";
    default:
      return "Notifikasi";
  }
}
