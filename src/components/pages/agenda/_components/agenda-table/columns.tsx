import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { deleteAgenda } from "@/server/actions/agenda.action";
import type { Prisma } from "@prisma/client";
import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { ArrowUpDown, Edit, MoreHorizontal, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type Agenda = Prisma.AgendaGetPayload<{
  include: {
    room: true;
    createdBy: true;
    accessDosen: true;
  };
}>;

export const columns: ColumnDef<Agenda>[] = [
  {
    id: "index",
    enableSorting: true,
    accessorFn: (_, index) => index + 1,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Nomor
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div className="font-medium">{row.index + 1}</div>,
  },
  {
    accessorKey: "title",
    enableSorting: true,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Judul Agenda
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("title")}</div>
    ),
  },
  {
    accessorKey: "startTime",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Waktu
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const startTime: Date = row.getValue("startTime");
      const endTime = row.original.endTime;

      return (
        <div className="flex flex-col">
          <div>{format(startTime, "dd MMM yyyy")}</div>
          <div className="text-muted-foreground">
            {format(startTime, "HH:mm")} - {format(endTime, "HH:mm")}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "priority",
    header: "Prioritas",
    enableSorting: true,
    cell: ({ row }) => {
      const priority: string = row.getValue("priority");

      return (
        <Badge
          variant={
            priority === "HIGH"
              ? "destructive"
              : priority === "MEDIUM"
                ? "secondary"
                : "default"
          }
        >
          {priority}
        </Badge>
      );
    },
  },
  {
    accessorKey: "room.name",
    header: "Ruangan",
    cell: ({ row }) => row.original.room.name,
    enableSorting: true,
  },
  {
    accessorKey: "access",
    header: "Hak Akses",
    cell: ({ row }) => {
      const accessMahasiswa = row.original.accessMahasiswa;
      const accessAllDosen = row.original.accessAllDosen;
      const accessSpecificDosen = row.original.accessDosen.length > 0;

      return (
        <div className="flex flex-wrap gap-1">
          {accessMahasiswa && <Badge variant="outline">Mahasiswa</Badge>}
          {accessAllDosen && <Badge variant="outline">Dosen</Badge>}
          {accessSpecificDosen && (
            <Badge variant="outline">Limited Dosen</Badge>
          )}
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const agenda = row.original;
      const router = useRouter();

      return (
        <AlertDialog>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href={`/admin/agenda/${agenda.id}/edit`}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Link>
              </DropdownMenuItem>
              <AlertDialogTrigger asChild>
                <DropdownMenuItem className="text-destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </AlertDialogTrigger>
            </DropdownMenuContent>
          </DropdownMenu>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the
                agenda and remove it from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={async () => {
                  try {
                    await deleteAgenda(agenda.id);
                    toast.success("Agenda deleted successfully");
                    router.refresh();
                  } catch (error) {
                    console.error(error);
                    toast.error("Failed to delete the agenda");
                  }
                }}
                className="bg-red-500 text-white hover:bg-red-500/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      );
    },
  },
];
