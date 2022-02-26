export function isOutOfRange(selectedDate: Date, minDate: Date | null, maxDate: Date | null): boolean {
    return (minDate !== null && selectedDate < (minDate as Date)) as boolean 
        || (maxDate !== null && selectedDate > (maxDate as Date)) as boolean;
}

export function getSelectableDateInScope(selectedDate: Date | undefined, currentMonth: number, currentYear: number): Date {
    return selectedDate?.getMonth() === currentMonth && selectedDate?.getFullYear() === currentYear 
        ? selectedDate 
        : new Date(currentYear, currentMonth, 1);
}

export function getMonths(locale: string): string[] {
    const { format } = new Intl.DateTimeFormat(locale, { month: "long" });
    return [...Array(12).keys()].map((m) =>
        format(new Date(Date.UTC(2021, m + 1)))
    );
}

export function getDaysOfTheWeek(locale: string): string[] {
    const { format } = new Intl.DateTimeFormat(locale, { weekday: "narrow" });
    return [...Array(7).keys()].map((day) =>
        format(new Date(Date.UTC(2021, 5, day)))
    );
}

export function addDaysToDate(date: Date, days: number) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

export function getWeeks(month: number, year: number): Date[][] {
    return getDays(month, year).reduce((p: Date[][], c, i) => {
        if (i % 7 === 0) {
            p[p.length] = [];
        }
        p[p.length - 1].push(c);
        return p;
    }, []);
}

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

function getDaysInMonth(month: number, year: number) {
    return new Date(year, month, 0).getDate();
}

