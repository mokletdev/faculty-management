"use client";

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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { deleteAgenda } from "@/server/actions/agenda";
import type { PaginationResult } from "@/types/pagination";
import type { Prisma } from "@prisma/client";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table";
import { format } from "date-fns";
import { Edit, MoreHorizontal, Trash2 } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState, type FC } from "react";
import { toast } from "sonner";
import { useDebouncedSearch } from "@/hooks/use-debounced-search";

interface Agenda {
  id: string;
  title: string;
  startTime: Date;
  endTime: Date;
  priority: string;
  room: {
    name: string;
  };
  accessMahasiswa: boolean;
  accessAllDosen: boolean;
}

// Update the AgendaTable component to handle server-side pagination
export const AgendaTable: FC<{
  agendaData: PaginationResult<
    Prisma.AgendaGetPayload<{
      include: {
        room: true;
        createdBy: true;
        accessDosen: true;
      };
    }>
  >;
}> = ({ agendaData }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const page = Number(searchParams.get("page") ?? "1");
  const pageSize = Number(searchParams.get("pageSize") ?? "10");
  const search = searchParams.get("search") ?? "";

  const { query: searchInput, setQuery: setSearchInput } = useDebouncedSearch(
    async (query) => {
      router.push(
        `${pathname}?${createQueryString({ search: query || null, page: 1 })}`,
      );
      return [];
    },
    1000,
  );

  const createQueryString = (
    params: Record<string, string | number | null>,
  ) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());

    Object.entries(params).forEach(([key, value]) => {
      if (value === null) {
        newSearchParams.delete(key);
      } else {
        newSearchParams.set(key, String(value));
      }
    });

    return newSearchParams.toString();
  };

  const handlePageChange = (newPage: number) => {
    router.push(`${pathname}?${createQueryString({ page: newPage })}`);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    router.push(
      `${pathname}?${createQueryString({ pageSize: newPageSize, page: 1 })}`,
    );
  };

  useEffect(() => {
    setSearchInput(search);
  }, [search, setSearchInput]);

  const columns: ColumnDef<Agenda>[] = [
    {
      accessorKey: "title",
      header: "Agenda Title",
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("title")}</div>
      ),
    },
    {
      accessorKey: "startTime",
      header: "Date & Time",
      cell: ({ row }) => {
        const startTime = row.getValue("startTime") as Date;
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
      header: "Priority",
      cell: ({ row }) => {
        const priority = row.getValue("priority") as string;

        return (
          <Badge
            variant={
              priority === "HIGH"
                ? "destructive"
                : priority === "MEDIUM"
                  ? "default"
                  : "secondary"
            }
          >
            {priority}
          </Badge>
        );
      },
    },
    {
      accessorKey: "room.name",
      header: "Room",
      cell: ({ row }) => row.original.room.name,
    },
    {
      accessorKey: "access",
      header: "Access",
      cell: ({ row }) => {
        const accessMahasiswa = row.original.accessMahasiswa;
        const accessAllDosen = row.original.accessAllDosen;

        return (
          <div className="flex flex-wrap gap-1">
            {accessMahasiswa && <Badge variant="outline">Mahasiswa</Badge>}
            {accessAllDosen && <Badge variant="outline">All Dosen</Badge>}
            {!accessMahasiswa && !accessAllDosen && (
              <Badge variant="outline">Limited</Badge>
            )}
          </div>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const agenda = row.original;

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
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
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

  const table = useReactTable({
    data: agendaData.data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    // Remove getPaginationRowModel since we're handling pagination on the server
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter agendas..."
          value={searchInput}
          onChange={(event) => setSearchInput(event.target.value)}
          className="max-w-sm"
        />
        <div className="ml-auto flex items-center gap-2">
          <Select
            value={String(pageSize)}
            onValueChange={(value) => handlePageSizeChange(Number(value))}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Rows per page" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5 per page</SelectItem>
              <SelectItem value="10">10 per page</SelectItem>
              <SelectItem value="20">20 per page</SelectItem>
              <SelectItem value="50">50 per page</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No agendas found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="text-muted-foreground flex-1 text-sm">
          Showing{" "}
          {agendaData.data.length > 0
            ? (agendaData.metadata.currentPage - 1) *
                agendaData.metadata.pageSize +
              1
            : 0}{" "}
          to{" "}
          {Math.min(
            agendaData.metadata.currentPage * agendaData.metadata.pageSize,
            agendaData.metadata.totalCount,
          )}{" "}
          of {agendaData.metadata.totalCount} agendas
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(page - 1)}
            disabled={page <= 1}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(page + 1)}
            disabled={page >= agendaData.metadata.totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};
