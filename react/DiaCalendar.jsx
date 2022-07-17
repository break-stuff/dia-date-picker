import React, { useEffect, useRef } from "react";
import "../index.js";

export function DiaCalendar({
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
}) {
  const ref = useRef(null);
  const component = ref.current;

  /** Event listeners - run once */

  useEffect(() => {
    if (onDiaFocus !== undefined) {
      component?.addEventListener("dia-focus", onDiaFocus);
    }
  }, []);

  useEffect(() => {
    if (onDiaSelect !== undefined) {
      component?.addEventListener("dia-select", onDiaSelect);
    }
  }, []);

  /** Boolean attributes - run whenever an attr has changed */

  useEffect(() => {
    if (showWeekNumbers !== undefined) {
      if (showWeekNumbers) {
        component?.setAttribute("showWeekNumbers", "");
      } else {
        component?.removeAttribute("showWeekNumbers");
      }
    }
  }, [showWeekNumbers]);

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

  return (
    <dia-calendar
      ref={ref}
      show-week-numbers={showWeekNumbers}
      value={value}
      min-date={minDate}
      max-date={maxDate}
      focus-date={focusDate}
      disabled-dates={disabledDates}
      disabled-week-days={disabledWeekDays}
      first-day-of-week={firstDayOfWeek}
      month-label={monthLabel}
      year-label={yearLabel}
      clear-label={clearLabel}
      today-label={todayLabel}
    >
      {children}
    </dia-calendar>
  );
}
