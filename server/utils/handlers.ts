import crypto from 'crypto';

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


export const getRandomDate = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = endDate ? new Date(endDate) : new Date();

  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

export const generateRandomNumber = (min: number, max: number) => {
  max = max >= min ? max : min;
  let maxDigit = '';
  for (let i = 0; i < max; i++) {
    maxDigit += '9';
  }
  let minDigit = '';
  for (let i = 0; i < min; i++) {
    minDigit += i === 0 ? '1' : '0';
  }
  const number = crypto.randomInt(Number(minDigit), Number(maxDigit));

  return number;
};
