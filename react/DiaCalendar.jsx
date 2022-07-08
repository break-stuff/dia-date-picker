import React, { useEffect, useRef } from "react";
import "../dist/dia-date-picker.es";

export function DiaCalendar({
  children,
  onDiaFocus,
  onDiaSelect,
  value,
  minDate,
  maxDate,
  focusDate,
  disabledDates,
  showWeekNumbers,
  disabledWeekDays,
  firstDayOfWeek,
  monthLabel,
  yearLabel,
  clearLabel,
  todayLabel,
  valueAsDate,
}) {
  const ref = useRef(null);

  /** Event listeners - run once */

  useEffect(() => {
    if (onDiaFocus !== undefined) {
      ref.current.addEventListener("dia-focus", onDiaFocus);
    }
  }, []);

  useEffect(() => {
    if (onDiaSelect !== undefined) {
      ref.current.addEventListener("dia-select", onDiaSelect);
    }
  }, []);

  /** Properties - run whenever a property has changed */

  useEffect(() => {
    if (value !== undefined && ref.current.value !== value) {
      ref.current.value = value;
    }
  }, [value]);

  useEffect(() => {
    if (minDate !== undefined && ref.current.minDate !== minDate) {
      ref.current.minDate = minDate;
    }
  }, [minDate]);

  useEffect(() => {
    if (maxDate !== undefined && ref.current.maxDate !== maxDate) {
      ref.current.maxDate = maxDate;
    }
  }, [maxDate]);

  useEffect(() => {
    if (focusDate !== undefined && ref.current.focusDate !== focusDate) {
      ref.current.focusDate = focusDate;
    }
  }, [focusDate]);

  useEffect(() => {
    if (
      disabledDates !== undefined &&
      ref.current.disabledDates !== disabledDates
    ) {
      ref.current.disabledDates = disabledDates;
    }
  }, [disabledDates]);

  useEffect(() => {
    if (
      showWeekNumbers !== undefined &&
      ref.current.showWeekNumbers !== showWeekNumbers
    ) {
      ref.current.showWeekNumbers = showWeekNumbers;
    }
  }, [showWeekNumbers]);

  useEffect(() => {
    if (
      disabledWeekDays !== undefined &&
      ref.current.disabledWeekDays !== disabledWeekDays
    ) {
      ref.current.disabledWeekDays = disabledWeekDays;
    }
  }, [disabledWeekDays]);

  useEffect(() => {
    if (
      firstDayOfWeek !== undefined &&
      ref.current.firstDayOfWeek !== firstDayOfWeek
    ) {
      ref.current.firstDayOfWeek = firstDayOfWeek;
    }
  }, [firstDayOfWeek]);

  useEffect(() => {
    if (monthLabel !== undefined && ref.current.monthLabel !== monthLabel) {
      ref.current.monthLabel = monthLabel;
    }
  }, [monthLabel]);

  useEffect(() => {
    if (yearLabel !== undefined && ref.current.yearLabel !== yearLabel) {
      ref.current.yearLabel = yearLabel;
    }
  }, [yearLabel]);

  useEffect(() => {
    if (clearLabel !== undefined && ref.current.clearLabel !== clearLabel) {
      ref.current.clearLabel = clearLabel;
    }
  }, [clearLabel]);

  useEffect(() => {
    if (todayLabel !== undefined && ref.current.todayLabel !== todayLabel) {
      ref.current.todayLabel = todayLabel;
    }
  }, [todayLabel]);

  useEffect(() => {
    if (valueAsDate !== undefined && ref.current.valueAsDate !== valueAsDate) {
      ref.current.valueAsDate = valueAsDate;
    }
  }, [valueAsDate]);

  return <dia-calendar ref={ref}>{children}</dia-calendar>;
}
