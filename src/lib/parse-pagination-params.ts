const isNumeric = (n: string) => {
  return !isNaN(Number(n)) && !isNaN(parseFloat(n));
};

export const parsePaginationParams = ({
  page: pageParam,
  pageSize: pageSizeParam,
  search: searchParam,
}: {
  page?: string;
  pageSize?: string;
  search?: string;
}) => {
  const page = pageParam && isNumeric(pageParam) ? Number(pageParam) : null;
  const pageSize =
    pageSizeParam && isNumeric(pageSizeParam) ? Number(pageSizeParam) : null;

  return {
    page,
    pageSize,
    search: searchParam,
  };
};
