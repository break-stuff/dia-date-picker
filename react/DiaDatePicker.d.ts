import React from "react";
import "react";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "dia-date-picker": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >;
    }
  }
}

export interface DiaDatePickerProps {
  children?: any;
  invalid?: boolean;
  required?: boolean;
  disabled?: boolean;
  readonly?: boolean;
  showWeekNumbers?: boolean | undefined;
  showErrorBelow?: boolean | undefined;
  showHelpTextBelow?: boolean | undefined;
  hideRequiredIndicator?: boolean | undefined;
  value?: string | undefined;
  label?: string | undefined;
  helpText?: string | undefined;
  name?: string | undefined;
  minDate?: string | undefined;
  maxDate?: string | undefined;
  focusDate?: string | undefined;
  disabledDates?: string | undefined;
  disabledWeekDays?: string | undefined;
  firstDayOfWeek?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | undefined;
  dayLabel?: string;
  monthLabel?: string;
  yearLabel?: string;
  clearLabel?: string;
  todayLabel?: string;
  requiredErrorMessage?: string;
  rangeErrorMessage?: string;
  unavailableErrorMessage?: string;
  customErrorMessage?: string | undefined;
  onDiaInput?: EventListenerOrEventListenerObject;
  onDiaChange?: EventListenerOrEventListenerObject;
}

declare module "react" {
  interface HTMLAttributes<T>
    extends AriaAttributes,
      DOMAttributes<T>,
      DiaDatePickerProps {}
}

export declare function DiaDatePicker({
  children,
  invalid,
  required,
  disabled,
  readonly,
  showWeekNumbers,
  showErrorBelow,
  showHelpTextBelow,
  hideRequiredIndicator,
  value,
  label,
  helpText,
  name,
  minDate,
  maxDate,
  focusDate,
  disabledDates,
  disabledWeekDays,
  firstDayOfWeek,
  dayLabel,
  monthLabel,
  yearLabel,
  clearLabel,
  todayLabel,
  requiredErrorMessage,
  rangeErrorMessage,
  unavailableErrorMessage,
  customErrorMessage,
  onDiaInput,
  onDiaChange,
}: DiaDatePickerProps): JSX.Element;
