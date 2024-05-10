export const getTimestampNumber = (d?: any): number => {
  const date = d ? new Date(d) : new Date();
  date.setHours(2);

  return date.getTime();
};

export const handlePaginate = (
  arr: any[],
  totalItems: number,
  pageIndex: number,
): any[] =>
  [...arr].slice(
    totalItems * (pageIndex * 1 - 1),
    totalItems * (pageIndex * 1 - 1) + totalItems * 1,
  );
