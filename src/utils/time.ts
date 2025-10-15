export const MS = { sec: 1000, min: 60_000, hour: 3_600_000, day: 86_400_000 };

export const pad = (num: number): string => String(num).padStart(2, "0");

export const now = (): Date => {
  return new Date();
};

export const yesterday = (): Date => {
  const date = new Date();
  date.setDate(date.getDate() - 1);
  return date;
};

export const startOfDay = (date: Date): Date => {
  const start = new Date(date);

  start.setHours(0, 0, 0, 0);
  return start;
};

export const isSameDay = (d1: Date, d2: Date): boolean => {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
};

export const isToday = (date: Date): boolean => {
  const today = new Date();

  return (
    today.getFullYear() === date.getFullYear() &&
    today.getMonth() === date.getMonth() &&
    today.getDate() === date.getDate()
  );
};

export const isThisYear = (d1: Date, d2: Date): boolean => {
  return d1.getFullYear() === d2.getFullYear();
};

export const differenceInMinutes = (d1: Date, d2: Date): number => {
  const diff = d2.getTime() - d1.getTime();
  return Math.abs(Math.floor(diff / (1000 * 60)));
};

// Formats a date into a specified format
export const formatDate = (date: Date, format: string): string => {
  if (isNaN(date.getTime())) return ""; // Invalid date

  const replacements: Record<string, string> = {
    YYYY: date.getFullYear().toString(),
    MM: pad(date.getMonth() + 1),
    DD: pad(date.getDate()),
    hh: pad(date.getHours()),
    mm: pad(date.getMinutes()),
    ss: pad(date.getSeconds()),
  };

  // Regex-replace tokens one by one
  return format.replace(
    /YYYY|MM|DD|hh|mm|ss/g,
    (match) => replacements[match] || match
  );
};

// Formats a date string into a human-readable relative time format
export const formatRelativeTime = (dateString: string): string => {
  const then = new Date(dateString);
  const current = now();

  const diffSec = Math.floor((current.getTime() - then.getTime()) / 1000);
  if (diffSec < 1) return "most";
  if (diffSec < 60) return `${diffSec} másodperce`;

  const diffMin = differenceInMinutes(then, current);
  if (diffMin < 60) return `${diffMin} perce`;

  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour} órája`;

  const diffDay = Math.floor(diffHour / 24);
  if (diffDay <= 7) return `${diffDay} napja`;

  // Ha több mint 7 nap
  if (isThisYear(then, current)) {
    // Ugyanaz az év: MM.DD
    return formatDate(then, "MM.DD");
  } else {
    // Más év: YY.MM.DD
    const full = formatDate(then, "YYYY.MM.DD");
    // csak az utolsó két jegy kell az évből
    return full.slice(2);
  }
};
