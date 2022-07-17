import React, { useEffect, useRef } from "react";
import "../index.js";
import type { DiaDatePicker as Component } from "../index.js";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
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

// extends React's HTMLAttributes
declare module "react" {
  interface HTMLAttributes<T>
    extends AriaAttributes,
      DOMAttributes<T>,
      DiaDatePickerProps {}
}

export function DiaDatePicker({
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
}: DiaDatePickerProps) {
  const ref = useRef<Component>(null);
  const component = ref.current as Component;

  /** Event listeners - run once */

  useEffect(() => {
    if (onDiaInput !== undefined) {
      component?.addEventListener("dia-input", onDiaInput);
    }
  }, []);

  useEffect(() => {
    if (onDiaChange !== undefined) {
      component?.addEventListener("dia-change", onDiaChange);
    }
  }, []);

  /** Boolean attributes - run whenever an attr has changed */

  useEffect(() => {
    if (invalid !== undefined) {
      if (invalid) {
        component?.setAttribute("invalid", "");
      } else {
        component?.removeAttribute("invalid");
      }
    }
  }, [invalid]);

  useEffect(() => {
    if (required !== undefined) {
      if (required) {
        component?.setAttribute("required", "");
      } else {
        component?.removeAttribute("required");
      }
    }
  }, [required]);

  useEffect(() => {
    if (disabled !== undefined) {
      if (disabled) {
        component?.setAttribute("disabled", "");
      } else {
        component?.removeAttribute("disabled");
      }
    }
  }, [disabled]);

  useEffect(() => {
    if (readonly !== undefined) {
      if (readonly) {
        component?.setAttribute("readonly", "");
      } else {
        component?.removeAttribute("readonly");
      }
    }
  }, [readonly]);

  useEffect(() => {
    if (showWeekNumbers !== undefined) {
      if (showWeekNumbers) {
        component?.setAttribute("showWeekNumbers", "");
      } else {
        component?.removeAttribute("showWeekNumbers");
      }
    }
  }, [showWeekNumbers]);

  useEffect(() => {
    if (showErrorBelow !== undefined) {
      if (showErrorBelow) {
        component?.setAttribute("showErrorBelow", "");
      } else {
        component?.removeAttribute("showErrorBelow");
      }
    }
  }, [showErrorBelow]);

  useEffect(() => {
    if (showHelpTextBelow !== undefined) {
      if (showHelpTextBelow) {
        component?.setAttribute("showHelpTextBelow", "");
      } else {
        component?.removeAttribute("showHelpTextBelow");
      }
    }
  }, [showHelpTextBelow]);

  useEffect(() => {
    if (hideRequiredIndicator !== undefined) {
      if (hideRequiredIndicator) {
        component?.setAttribute("hideRequiredIndicator", "");
      } else {
        component?.removeAttribute("hideRequiredIndicator");
      }
    }
  }, [hideRequiredIndicator]);

  /** Attributes - run whenever an attr has changed */

  useEffect(() => {
    if (
      value !== undefined &&
      component?.getAttribute("value") !== String(value)
    ) {
      component?.setAttribute("value", String(value));
    }
  }, [value]);

  useEffect(() => {
    if (
      label !== undefined &&
      component?.getAttribute("label") !== String(label)
    ) {
      component?.setAttribute("label", String(label));
    }
  }, [label]);

  useEffect(() => {
    if (
      helpText !== undefined &&
      component?.getAttribute("helpText") !== String(helpText)
    ) {
      component?.setAttribute("helpText", String(helpText));
    }
  }, [helpText]);

  useEffect(() => {
    if (
      name !== undefined &&
      component?.getAttribute("name") !== String(name)
    ) {
      component?.setAttribute("name", String(name));
    }
  }, [name]);

  useEffect(() => {
    if (
      minDate !== undefined &&
      component?.getAttribute("minDate") !== String(minDate)
    ) {
      component?.setAttribute("minDate", String(minDate));
    }
  }, [minDate]);

  useEffect(() => {
    if (
      maxDate !== undefined &&
      component?.getAttribute("maxDate") !== String(maxDate)
    ) {
      component?.setAttribute("maxDate", String(maxDate));
    }
  }, [maxDate]);

  useEffect(() => {
    if (
      focusDate !== undefined &&
      component?.getAttribute("focusDate") !== String(focusDate)
    ) {
      component?.setAttribute("focusDate", String(focusDate));
    }
  }, [focusDate]);

  useEffect(() => {
    if (
      disabledDates !== undefined &&
      component?.getAttribute("disabledDates") !== String(disabledDates)
    ) {
      component?.setAttribute("disabledDates", String(disabledDates));
    }
  }, [disabledDates]);

  useEffect(() => {
    if (
      disabledWeekDays !== undefined &&
      component?.getAttribute("disabledWeekDays") !== String(disabledWeekDays)
    ) {
      component?.setAttribute("disabledWeekDays", String(disabledWeekDays));
    }
  }, [disabledWeekDays]);

  useEffect(() => {
    if (
      firstDayOfWeek !== undefined &&
      component?.getAttribute("firstDayOfWeek") !== String(firstDayOfWeek)
    ) {
      component?.setAttribute("firstDayOfWeek", String(firstDayOfWeek));
    }
  }, [firstDayOfWeek]);

  useEffect(() => {
    if (
      dayLabel !== undefined &&
      component?.getAttribute("dayLabel") !== String(dayLabel)
    ) {
      component?.setAttribute("dayLabel", String(dayLabel));
    }
  }, [dayLabel]);

  useEffect(() => {
    if (
      monthLabel !== undefined &&
      component?.getAttribute("monthLabel") !== String(monthLabel)
    ) {
      component?.setAttribute("monthLabel", String(monthLabel));
    }
  }, [monthLabel]);

  useEffect(() => {
    if (
      yearLabel !== undefined &&
      component?.getAttribute("yearLabel") !== String(yearLabel)
    ) {
      component?.setAttribute("yearLabel", String(yearLabel));
    }
  }, [yearLabel]);

  useEffect(() => {
    if (
      clearLabel !== undefined &&
      component?.getAttribute("clearLabel") !== String(clearLabel)
    ) {
      component?.setAttribute("clearLabel", String(clearLabel));
    }
  }, [clearLabel]);

  useEffect(() => {
    if (
      todayLabel !== undefined &&
      component?.getAttribute("todayLabel") !== String(todayLabel)
    ) {
      component?.setAttribute("todayLabel", String(todayLabel));
    }
  }, [todayLabel]);

  useEffect(() => {
    if (
      requiredErrorMessage !== undefined &&
      component?.getAttribute("requiredErrorMessage") !==
        String(requiredErrorMessage)
    ) {
      component?.setAttribute(
        "requiredErrorMessage",
        String(requiredErrorMessage)
      );
    }
  }, [requiredErrorMessage]);

  useEffect(() => {
    if (
      rangeErrorMessage !== undefined &&
      component?.getAttribute("rangeErrorMessage") !== String(rangeErrorMessage)
    ) {
      component?.setAttribute("rangeErrorMessage", String(rangeErrorMessage));
    }
  }, [rangeErrorMessage]);

  useEffect(() => {
    if (
      unavailableErrorMessage !== undefined &&
      component?.getAttribute("unavailableErrorMessage") !==
        String(unavailableErrorMessage)
    ) {
      component?.setAttribute(
        "unavailableErrorMessage",
        String(unavailableErrorMessage)
      );
    }
  }, [unavailableErrorMessage]);

  useEffect(() => {
    if (
      customErrorMessage !== undefined &&
      component?.getAttribute("customErrorMessage") !==
        String(customErrorMessage)
    ) {
      component?.setAttribute("customErrorMessage", String(customErrorMessage));
    }
  }, [customErrorMessage]);

  return (
    <dia-date-picker
      ref={ref}
      invalid={invalid}
      required={required}
      disabled={disabled}
      readonly={readonly}
      show-week-numbers={showWeekNumbers}
      show-error-below={showErrorBelow}
      show-help-text-below={showHelpTextBelow}
      hide-required-indicator={hideRequiredIndicator}
      value={value}
      label={label}
      help-text={helpText}
      name={name}
      min-date={minDate}
      max-date={maxDate}
      focus-date={focusDate}
      disabled-dates={disabledDates}
      disabled-week-days={disabledWeekDays}
      first-day-of-week={firstDayOfWeek}
      day-label={dayLabel}
      month-label={monthLabel}
      year-label={yearLabel}
      clear-label={clearLabel}
      today-label={todayLabel}
      required-error-message={requiredErrorMessage}
      range-error-message={rangeErrorMessage}
      unavailable-error-message={unavailableErrorMessage}
      custom-error-message={customErrorMessage}
    >
      {children}
    </dia-date-picker>
  );
}
