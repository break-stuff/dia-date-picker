import React, { useEffect, useRef } from "react";
import "dia-date-picker/dist/index.js";
import type { DiaCalendar as Component } from "dia-date-picker/dist/index.js";

export interface DiaCalendarProps {
  childrenshowWeekNumbers?: boolean;
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
}: DiaCalendarProps) {
  const ref = useRef < Component > null;
  const component = ref.current;

  /** Event listeners - run once */

  useEffect(() => {
    if (onDiaFocus !== undefined) {
      component.addEventListener("dia-focus", onDiaFocus);
    }
  }, []);

  useEffect(() => {
    if (onDiaSelect !== undefined) {
      component.addEventListener("dia-select", onDiaSelect);
    }
  }, []);

  /** Boolean attributes - run whenever an attr has changed */

  useEffect(() => {
    if (showWeekNumbers !== undefined) {
      if (showWeekNumbers) {
        component.setAttribute("showWeekNumbers", "");
      } else {
        component.removeAttribute("showWeekNumbers");
      }
    }
  }, [showWeekNumbers]);

  /** Attributes - run whenever an attr has changed */

  useEffect(() => {
    if (
      value !== undefined &&
      component.getAttribute("value") !== String(value)
    ) {
      component.setAttribute("value", value);
    }
  }, [value]);

  useEffect(() => {
    if (
      minDate !== undefined &&
      component.getAttribute("minDate") !== String(minDate)
    ) {
      component.setAttribute("minDate", minDate);
    }
  }, [minDate]);

  useEffect(() => {
    if (
      maxDate !== undefined &&
      component.getAttribute("maxDate") !== String(maxDate)
    ) {
      component.setAttribute("maxDate", maxDate);
    }
  }, [maxDate]);

  useEffect(() => {
    if (
      focusDate !== undefined &&
      component.getAttribute("focusDate") !== String(focusDate)
    ) {
      component.setAttribute("focusDate", focusDate);
    }
  }, [focusDate]);

  useEffect(() => {
    if (
      disabledDates !== undefined &&
      component.getAttribute("disabledDates") !== String(disabledDates)
    ) {
      component.setAttribute("disabledDates", disabledDates);
    }
  }, [disabledDates]);

  useEffect(() => {
    if (
      disabledWeekDays !== undefined &&
      component.getAttribute("disabledWeekDays") !== String(disabledWeekDays)
    ) {
      component.setAttribute("disabledWeekDays", disabledWeekDays);
    }
  }, [disabledWeekDays]);

  useEffect(() => {
    if (
      firstDayOfWeek !== undefined &&
      component.getAttribute("firstDayOfWeek") !== String(firstDayOfWeek)
    ) {
      component.setAttribute("firstDayOfWeek", firstDayOfWeek);
    }
  }, [firstDayOfWeek]);

  useEffect(() => {
    if (
      monthLabel !== undefined &&
      component.getAttribute("monthLabel") !== String(monthLabel)
    ) {
      component.setAttribute("monthLabel", monthLabel);
    }
  }, [monthLabel]);

  useEffect(() => {
    if (
      yearLabel !== undefined &&
      component.getAttribute("yearLabel") !== String(yearLabel)
    ) {
      component.setAttribute("yearLabel", yearLabel);
    }
  }, [yearLabel]);

  useEffect(() => {
    if (
      clearLabel !== undefined &&
      component.getAttribute("clearLabel") !== String(clearLabel)
    ) {
      component.setAttribute("clearLabel", clearLabel);
    }
  }, [clearLabel]);

  useEffect(() => {
    if (
      todayLabel !== undefined &&
      component.getAttribute("todayLabel") !== String(todayLabel)
    ) {
      component.setAttribute("todayLabel", todayLabel);
    }
  }, [todayLabel]);

  return <dia-calendar ref={ref}>{children}</dia-calendar>;
}
