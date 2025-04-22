"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { AgendaWithRoom } from "@/types";
import { format } from "date-fns";
import { CalendarIcon, Clock, MapPin, User, Users } from "lucide-react";

interface AgendaDetailsDialogProps {
  agenda: AgendaWithRoom;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AgendaDetailsDialog({
  agenda,
  open,
  onOpenChange,
}: AgendaDetailsDialogProps) {
  const startDate = format(new Date(agenda.startTime), "EEEE, MMMM d, yyyy");
  const startTime = format(new Date(agenda.startTime), "h:mm a");
  const endTime = format(new Date(agenda.endTime), "h:mm a");

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "HIGH":
        return "bg-red-500 text-white";
      case "MEDIUM":
        return "bg-orange-500 text-white";
      case "LOW":
        return "bg-green-500 text-white";
      default:
        return "bg-blue-500 text-white";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {agenda.title}
          </DialogTitle>
        </DialogHeader>

        <div className="mt-4 space-y-5">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className={getPriorityColor(agenda.priority)}>
              {agenda.priority} Priority
            </Badge>
            {agenda.accessAllDosen && (
              <Badge variant="outline">Visible to All Dosen</Badge>
            )}
            {agenda.accessMahasiswa && (
              <Badge variant="outline">Visible to Mahasiswa</Badge>
            )}
          </div>

          <div className="bg-muted/40 grid gap-4 rounded-lg border p-4">
            <div className="flex items-start gap-3">
              <div className="bg-primary/10 rounded-full p-2">
                <CalendarIcon className="text-primary h-5 w-5" />
              </div>
              <div>
                <p className="font-medium">{startDate}</p>
                <div className="text-muted-foreground mt-1 flex items-center gap-1 text-sm">
                  <Clock className="h-3.5 w-3.5" />
                  <span>
                    {startTime} - {endTime}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-primary/10 rounded-full p-2">
                <MapPin className="text-primary h-5 w-5" />
              </div>
              <div>
                <p className="font-medium">{agenda.room.name}</p>
                {agenda.room.location && (
                  <p className="text-muted-foreground text-sm">
                    {agenda.room.location}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-primary/10 rounded-full p-2">
                <User className="text-primary h-5 w-5" />
              </div>
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage
                    src={agenda.createdBy?.image ?? ""}
                    alt={agenda.createdBy?.name ?? "Unknown"}
                  />
                  <AvatarFallback>
                    {agenda.createdBy?.name?.[0] ?? "U"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">
                    {agenda.createdBy?.name ?? "Unknown"}
                  </p>
                  <p className="text-muted-foreground text-xs">
                    {agenda.createdBy?.email}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {agenda.accessDosen && agenda.accessDosen.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Users className="text-muted-foreground h-4 w-4" />
                <p className="text-sm font-medium">Shared with:</p>
              </div>
              <div className="bg-muted/30 flex flex-wrap gap-2 rounded-lg p-3">
                {agenda.accessDosen.map((access) => (
                  <div
                    key={access.id}
                    className="bg-background flex items-center gap-2 rounded-full border py-1 pr-3 pl-1 shadow-sm"
                  >
                    <Avatar className="h-6 w-6">
                      <AvatarImage
                        src={access.user?.image ?? ""}
                        alt={access.user?.name ?? "Unknown"}
                      />
                      <AvatarFallback>
                        {access.user?.name?.[0] ?? "U"}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{access.user?.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {agenda.description && (
            <div className="space-y-2">
              <p className="text-sm font-medium">Description</p>
              <div className="bg-muted/30 rounded-lg p-3 text-sm">
                {agenda.description}
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
