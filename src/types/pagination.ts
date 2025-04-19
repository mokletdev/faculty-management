export type PaginationResult<T> = {
  data: T[];
  metadata: {
    totalCount: number;
    currentPage: number;
    pageSize: number;
    totalPages: number;
  };
};
