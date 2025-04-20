import { Skeleton } from "@/components/ui/skeleton";

export function CalendarSkeleton() {
  return (
    <div className="h-[80vh] space-y-4 rounded-xl border bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-9 rounded-full" />
          <Skeleton className="h-9 w-9 rounded-full" />
          <Skeleton className="h-9 w-9 rounded-full" />
          <Skeleton className="ml-2 h-8 w-40" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-24" />
          <Skeleton className="h-9 w-24" />
          <Skeleton className="h-10 w-[300px]" />
        </div>
      </div>

      <div className="mb-2 flex gap-2">
        <Skeleton className="h-6 w-28" />
        <Skeleton className="h-6 w-28" />
        <Skeleton className="h-6 w-28" />
      </div>

      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: 7 }).map((_, i) => (
          <Skeleton key={`header-${i}`} className="h-12" />
        ))}

        {Array.from({ length: 35 }).map((_, i) => (
          <Skeleton key={`cell-${i}`} className="h-24" />
        ))}
      </div>
    </div>
  );
}
