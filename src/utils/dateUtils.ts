interface IWeekDay {
  abbr: string;
  fullDay: string;
}

/**
 * Checks to see if date object is a valid date
 * @param date date to evaluate
 * @returns boolean
 */
export function isValidDate(date: Date) {
  return date instanceof Date && !isNaN(date as any);
}

/**
 * Converts date string to a format that has cross-browser support
 * @param date date string consisting of numeric day, month, and year
 * @returns string - date string where all non-numeric characters have been converted to "/" - "mm-dd-yyyy" => ""
 */
export function formatDateString(date: string): string {
  return date.replace(/\D/g, '/');
}

/**
 * Converts date to full format based on locale
 * @param date
 * @param locale
 * @returns returns date in full format based on locale
 */
export function getFullDate(date: Date, locale: string): string {
  const formatter = new Intl.DateTimeFormat(locale, { dateStyle: 'long' });
  return formatter.format(date);
}

/**
 * Converts date to short ISO format - YYYY-MM-DD
 * @param date
 * @returns returns short date in ISO format - 2022-02-22
 */
export function getShortIsoDate(date: Date) {
  const pad = (value: number) => value < 10 ? '0' + value : value;
  return `${date.getFullYear()}-${pad(date.getMonth())}-${pad(date.getDate())}`;
}

/**
 * Determines if a date falls outside of min/max date parameters
 * @param selectedDate date being compared
 * @param minDate minimum viable date
 * @param maxDate maximum viable date
 * @returns boolean
 */
export function isOutOfRange(
  selectedDate: Date,
  minDate: Date | null,
  maxDate: Date | null
): boolean {
  return (
    ((minDate !== null && selectedDate < (minDate as Date)) as boolean) ||
    ((maxDate !== null && selectedDate > (maxDate as Date)) as boolean)
  );
}

/**
 * Gets first available date in a given month scope
 * @param selectedDate date being compared
 * @param currentMonth current selected month
 * @param currentYear current selected year
 * @returns Date - first available date in a selected month
 */
export function getSelectableDateInScope(
  selectedDate: Date | undefined,
  currentMonth: number,
  currentYear: number
): Date {
  return selectedDate?.getMonth() === currentMonth &&
    selectedDate?.getFullYear() === currentYear
    ? selectedDate
    : new Date(currentYear, currentMonth, 1);
}

/**
 * Gets a list of month names based on a given locale
 * @param locale country language locale
 * @returns string[] - list of months
 */
export function getMonths(locale: string): string[] {
  const { format } = new Intl.DateTimeFormat(locale, { month: 'long' });
  return [...Array(12).keys()].map(m =>
    format(new Date(2021, m, 1))
  );
}

export function getMonthLabel(
  month: number,
  year: number,
  locale: string
): string {
  const { format } = new Intl.DateTimeFormat(locale, {
    month: 'long',
    year: 'numeric',
  });
  return format(new Date(year, month + 1, 0));
}

/**
 * Gets a list of week day abbreviations based on locale
 * @param locale country language locale
 * @returns IWeekDay[] - list of week day abbreviations and full names
 */
export function getDaysOfTheWeek(locale: string): IWeekDay[] {
  const abbrFormat = new Intl.DateTimeFormat(locale, { weekday: 'narrow' })
    .format;
  const fullFormat = new Intl.DateTimeFormat(locale, { weekday: 'long' })
    .format;

  return [...Array(7).keys()].map(day => {
    const date = new Date(Date.UTC(2021, 5, day));
    return {
      abbr: abbrFormat(date),
      fullDay: fullFormat(date),
    };
  });
}

/**
 * Adds (or subtracts) days to a given date
 * @param date date that is being added days
 * @param days number of days being added - use negative numbers to subtract
 * @returns Date - new date with changes applied
 */
export function addDaysToDate(date: Date, days: number) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

/**
 * Gets numbers of days in a month based on year
 * @param month month where you want to get days (1 = January)
 * @param year year where you want to get days
 * @returns number of days in a month
 */
export function getDaysInMonth(month: number, year: number) {
  return new Date(year, month + 1, 0).getDate();
}

/**
 * Gets a list of weeks for a given month and year (includes padding for prev and next months)
 * @param month the month you are building the calendar for
 * @param year the year you are building the calendar for
 * @returns An array (weeks) of dates (days)
 */
export function getWeeks(month: number, year: number): Date[][] {
  return getDays(month, year).reduce((p: Date[][], c, i) => {
    if (i % 7 === 0) {
      p[p.length] = [];
    }
    p[p.length - 1].push(c);
    return p;
  }, []);
}

/**
 * Gets days based on a given week of the calendar
 * @param month the month you are building the calendar for
 * @param year the year you are building the calendar for
 * @returns Date[] - a list of days of the week
 */
function getDays(month: number, year: number): Date[] {
  const dates = [];
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month, getDaysInMonth(month, year));
  dates.unshift(firstDayOfMonth);

  // prev month days
  for (
    let d = addDaysToDate(firstDayOfMonth, -1);
    d.getDay() !== 6;
    d = addDaysToDate(d, -1)
  ) {
    dates.unshift(d);
  }

  // current month days
  for (
    let d = addDaysToDate(firstDayOfMonth, 1);
    d <= lastDayOfMonth;
    d = addDaysToDate(d, 1)
  ) {
    dates.push(d);
  }

  //next month days
  for (
    let d = addDaysToDate(lastDayOfMonth, 1);
    d.getDay() !== 0;
    d = addDaysToDate(d, 1)
  ) {
    dates.push(d);
  }
  return dates;
}

/**
 * 
 * @param locale 
 * @returns string array of the month, day, and year along with its separators in the correct order based on locale
 */
export function getDateFormat(locale: string) {
  const localeFormat = new Date(1999, 11, 31)
    .toLocaleDateString(locale)
    .match(/[\d]+|\D+/g)
    ?.map(x => {
      if (x === '12') {
        return 'mm';
      } else if (x === '31') {
        return 'dd';
      } else if (x === '1999') {
        return 'yyyy';
      } else {
        return x;
      }
    });
  
  return localeFormat || [];
}

export function getWeek(date: Date) {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date.valueOf() - firstDayOfYear.valueOf()) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
}