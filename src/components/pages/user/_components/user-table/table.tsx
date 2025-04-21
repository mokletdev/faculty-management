"use client";

import { Button } from "@/components/ui/button";
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
import { useDebouncedSearch } from "@/hooks/use-debounced-search";
import type { PaginationResult } from "@/types/pagination";
import type { Prisma, UserRole } from "@prisma/client";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, type FC } from "react";
import { columns } from "./columns";

type User = Prisma.UserGetPayload<{
  select: {
    id: true;
    name: true;
    email: true;
    image: true;
    role: true;
  };
}>;

export const UserTable: FC<{
  userData: PaginationResult<User>;
}> = ({ userData }) => {
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
  const role = searchParams.get("role") as UserRole | null;

  const {
    query: searchInput,
    setQuery: setSearchInput,
    reset: resetSearch,
  } = useDebouncedSearch(async (query) => {
    router.push(
      `${pathname}?${createQueryString({ search: query || null, page: 1 })}`,
    );
    return [];
  }, 1000);

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

  const handleRoleChange = (newRole: string | null) => {
    router.push(`${pathname}?${createQueryString({ role: newRole, page: 1 })}`);
  };

  useEffect(() => {
    setSearchInput(search);
  }, [search, setSearchInput]);

  const table = useReactTable({
    data: userData.data,
    columns: columns,
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
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-start gap-y-4 py-4 md:flex-row md:items-center md:justify-between">
        <Input
          placeholder="Cari Pengguna..."
          value={searchInput}
          onChange={(event) =>
            event.target.value.trim()
              ? setSearchInput(event.target.value)
              : resetSearch()
          }
          className="max-w-sm"
        />
        <div className="flex items-center gap-2">
          <Select
            value={role || ""}
            onValueChange={(value) => handleRoleChange(value || null)}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Filter Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Semua Role</SelectItem>
              <SelectItem value="ADMIN">Admin</SelectItem>
              <SelectItem value="DOSEN">Dosen</SelectItem>
            </SelectContent>
          </Select>
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

      <div className="rounded-md">
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
                  No users found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="text-muted-foreground flex-1 text-sm">
          Showing{" "}
          {userData.data.length > 0
            ? (userData.metadata.currentPage - 1) * userData.metadata.pageSize +
              1
            : 0}{" "}
          to{" "}
          {Math.min(
            userData.metadata.currentPage * userData.metadata.pageSize,
            userData.metadata.totalCount,
          )}{" "}
          of {userData.metadata.totalCount} users
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
            disabled={page >= userData.metadata.totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};
