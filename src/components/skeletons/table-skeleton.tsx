import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function TableSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center py-4">
        <Skeleton className="h-10 w-[250px]" />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Skeleton className="h-6 w-[150px]" />
              </TableHead>
              <TableHead>
                <Skeleton className="h-6 w-[120px]" />
              </TableHead>
              <TableHead>
                <Skeleton className="h-6 w-[80px]" />
              </TableHead>
              <TableHead>
                <Skeleton className="h-6 w-[100px]" />
              </TableHead>
              <TableHead>
                <Skeleton className="h-6 w-[100px]" />
              </TableHead>
              <TableHead>
                <Skeleton className="h-6 w-[50px]" />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Skeleton className="h-6 w-[150px]" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-6 w-[120px]" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-6 w-[80px]" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-6 w-[100px]" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-6 w-[100px]" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-6 w-[50px]" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
