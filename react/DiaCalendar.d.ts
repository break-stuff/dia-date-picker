import React from "react";
import "../index.js";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "dia-calendar": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >;
    }
  }
}

export interface DiaCalendarProps {
  children?: any;
  showWeekNumbers?: boolean;
  value?: string | undefined;
  minDate?: string | undefined;
  maxDate?: string | undefined;
  focusDate?: string | undefined;
  disabledDates?: string | undefined;
  disabledWeekDays?: string | undefined;
  firstDayOfWeek?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | undefined;
  monthLabel?: string;
  yearLabel?: string;
  clearLabel?: string;
  todayLabel?: string;
  onDiaFocus?: EventListenerOrEventListenerObject;
  onDiaSelect?: EventListenerOrEventListenerObject;
}

declare module "react" {
  interface HTMLAttributes<T>
    extends AriaAttributes,
      DOMAttributes<T>,
      DiaCalendarProps {}
}

export declare function DiaCalendar({
  children,
  showWeekNumbers,
  value,
  minDate,
  maxDate,
  focusDate,
  disabledDates,
  disabledWeekDays,
  firstDayOfWeek,
  monthLabel,
  yearLabel,
  clearLabel,
  todayLabel,
  onDiaFocus,
  onDiaSelect,
}: DiaCalendarProps): JSX.Element;
