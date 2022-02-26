/**
 * Determines if a date falls outside of min/max date parameters
 * @param selectedDate date being compared
 * @param minDate minimum viable date
 * @param maxDate maximum viable date
 * @returns boolean
 */
export function isOutOfRange(selectedDate: Date, minDate: Date | null, maxDate: Date | null): boolean {
    return (minDate !== null && selectedDate < (minDate as Date)) as boolean 
        || (maxDate !== null && selectedDate > (maxDate as Date)) as boolean;
}

/**
 * Gets first available date in a given month scope
 * @param selectedDate date being compared
 * @param currentMonth current selected month
 * @param currentYear current selected year
 * @returns Date - first available date in a selected month
 */
export function getSelectableDateInScope(selectedDate: Date | undefined, currentMonth: number, currentYear: number): Date {
    return selectedDate?.getMonth() === currentMonth && selectedDate?.getFullYear() === currentYear 
        ? selectedDate 
        : new Date(currentYear, currentMonth, 1);
}

/**
 * Gets a list of month names based on a given locale
 * @param locale country language locale
 * @returns string[] - list of months
 */
export function getMonths(locale: string): string[] {
    const { format } = new Intl.DateTimeFormat(locale, { month: "long" });
    return [...Array(12).keys()].map((m) =>
        format(new Date(Date.UTC(2021, m + 1)))
    );
}

/**
 * Gets a list of week day abbreviations based on locale
 * @param locale country language locale
 * @returns string[] - list of week day abbreviations
 */
export function getDaysOfTheWeek(locale: string): string[] {
    const { format } = new Intl.DateTimeFormat(locale, { weekday: "narrow" });
    return [...Array(7).keys()].map((day) =>
        format(new Date(Date.UTC(2021, 5, day)))
    );
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
  return new Date(year, month, 0).getDate();
}

/**
 * 
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
    const dates: Date[] = [];
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(
        year,
        month,
        getDaysInMonth(month, year)
    );
    dates.unshift(firstDayOfMonth);
    for (
        let d = addDaysToDate(firstDayOfMonth, -1);
        d.getDay() !== 6;
        d = addDaysToDate(d, -1)
    ) {
        dates.unshift(d);
    }
    for (
        let d = addDaysToDate(firstDayOfMonth, 1);
        d <= lastDayOfMonth;
        d = addDaysToDate(d, 1)
    ) {
        dates.push(d);
    }
    for (
        let d = addDaysToDate(lastDayOfMonth, 1);
        d.getDay() !== 0;
        d = addDaysToDate(d, 1)
    ) {
        dates.push(d);
    }
    return dates;
}
