export const getTimestampNumber = (d?: any): number => {
  const date = d ? new Date(d) : new Date;
  date.setHours(2);

  return date.getTime();
}

export const handlePaginate = () => {
  //
}