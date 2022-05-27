export function dateToTimestamp(date: Date): number {
  return Math.floor(date.getTime() / 1000);
}

export function timestampToDate(timestamp: number): Date {
  return new Date(timestamp * 1000);
}

export function subtractYears(timestamp: number, years: number): number {
  const date = new Date(timestamp * 1000);
  date.setFullYear(date.getFullYear() - years);
  return dateToTimestamp(date);
}
