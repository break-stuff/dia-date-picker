import React, { useEffect, useRef } from "react";
import "../dist/dia-date-picker.es";

export function DiaDatePicker({
  children,
  onDiaInput,
  onDiaChange,
  value,
  label,
  helpText,
  name,
  invalid,
  required,
  disabled,
  readonly,
  minDate,
  maxDate,
  focusDate,
  disabledDates,
  showWeekNumbers,
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
  showErrorBelow,
  showHelpTextBelow,
  hideRequiredIndicator,
  valueAsDate,
}) {
  const ref = useRef(null);

  /** Event listeners - run once */

  useEffect(() => {
    if (onDiaInput !== undefined) {
      ref.current.addEventListener("dia-input", onDiaInput);
    }
  }, []);

  useEffect(() => {
    if (onDiaChange !== undefined) {
      ref.current.addEventListener("dia-change", onDiaChange);
    }
  }, []);

  /** Properties - run whenever a property has changed */

  useEffect(() => {
    if (value !== undefined && ref.current.value !== value) {
      ref.current.value = value;
    }
  }, [value]);

  useEffect(() => {
    if (label !== undefined && ref.current.label !== label) {
      ref.current.label = label;
    }
  }, [label]);

  useEffect(() => {
    if (helpText !== undefined && ref.current.helpText !== helpText) {
      ref.current.helpText = helpText;
    }
  }, [helpText]);

  useEffect(() => {
    if (name !== undefined && ref.current.name !== name) {
      ref.current.name = name;
    }
  }, [name]);

  useEffect(() => {
    if (invalid !== undefined && ref.current.invalid !== invalid) {
      ref.current.invalid = invalid;
    }
  }, [invalid]);

  useEffect(() => {
    if (required !== undefined && ref.current.required !== required) {
      ref.current.required = required;
    }
  }, [required]);

  useEffect(() => {
    if (disabled !== undefined && ref.current.disabled !== disabled) {
      ref.current.disabled = disabled;
    }
  }, [disabled]);

  useEffect(() => {
    if (readonly !== undefined && ref.current.readonly !== readonly) {
      ref.current.readonly = readonly;
    }
  }, [readonly]);

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
    if (dayLabel !== undefined && ref.current.dayLabel !== dayLabel) {
      ref.current.dayLabel = dayLabel;
    }
  }, [dayLabel]);

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
    if (
      requiredErrorMessage !== undefined &&
      ref.current.requiredErrorMessage !== requiredErrorMessage
    ) {
      ref.current.requiredErrorMessage = requiredErrorMessage;
    }
  }, [requiredErrorMessage]);

  useEffect(() => {
    if (
      rangeErrorMessage !== undefined &&
      ref.current.rangeErrorMessage !== rangeErrorMessage
    ) {
      ref.current.rangeErrorMessage = rangeErrorMessage;
    }
  }, [rangeErrorMessage]);

  useEffect(() => {
    if (
      unavailableErrorMessage !== undefined &&
      ref.current.unavailableErrorMessage !== unavailableErrorMessage
    ) {
      ref.current.unavailableErrorMessage = unavailableErrorMessage;
    }
  }, [unavailableErrorMessage]);

  useEffect(() => {
    if (
      customErrorMessage !== undefined &&
      ref.current.customErrorMessage !== customErrorMessage
    ) {
      ref.current.customErrorMessage = customErrorMessage;
    }
  }, [customErrorMessage]);

  useEffect(() => {
    if (
      showErrorBelow !== undefined &&
      ref.current.showErrorBelow !== showErrorBelow
    ) {
      ref.current.showErrorBelow = showErrorBelow;
    }
  }, [showErrorBelow]);

  useEffect(() => {
    if (
      showHelpTextBelow !== undefined &&
      ref.current.showHelpTextBelow !== showHelpTextBelow
    ) {
      ref.current.showHelpTextBelow = showHelpTextBelow;
    }
  }, [showHelpTextBelow]);

  useEffect(() => {
    if (
      hideRequiredIndicator !== undefined &&
      ref.current.hideRequiredIndicator !== hideRequiredIndicator
    ) {
      ref.current.hideRequiredIndicator = hideRequiredIndicator;
    }
  }, [hideRequiredIndicator]);

  useEffect(() => {
    if (valueAsDate !== undefined && ref.current.valueAsDate !== valueAsDate) {
      ref.current.valueAsDate = valueAsDate;
    }
  }, [valueAsDate]);

  return <dia-date-picker ref={ref}>{children}</dia-date-picker>;
}
