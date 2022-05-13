/* eslint-disable class-methods-use-this */
/* eslint-disable no-console */
import { html, LitElement, PropertyValueMap } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { FormFieldData } from '../date-picker';
import {
  addDaysToDate,
  getDaysOfTheWeek,
  getShortIsoDate,
  getMonths,
  getWeeks,
  isOutOfRange,
  getFullDate,
  getMonthLabel,
  formatDateString,
  getWeek,
  getDaysInMonth,
} from '../utils/dateUtils';
import icon from '../utils/icons';
import { watch } from '../utils/watchDecorator';

import { styles } from './calendar.styles';

/**
 * @tag ks-calendar
 *
 * @summary Custom calendar element
 *
 * @slot prev-month-icon - icon in previous month button
 * @slot next-month-icon - icon in next month button
 *
 * @cssprop [--ks-border-color=rgb(var(--ks-color-light-base))] - Default border color
 * @cssprop [--ks-border-radius=0.25rem] - Default border radius
 * @cssprop [--ks-disabled-color=#8d8d8d] - Color of disabled days
 * @cssprop [--ks-error-color=rgb(var(--ks-color-danger-base))] - Color used to communicate error in the component
 * @cssprop [--ks-outline=var(--ks-default-outline)] - Default focus outline style
 * @cssprop [--ks-outline-offset=0.125rem] - Outline offset
 * @cssprop [--ks-primary-color=rgb(var(--ks-color-light-dark))] - Primary color used in the component
 *
 * @csspart input - Controls styles of calendar inputs (month and year)
 * @csspart button - Controls styles of buttons
 * @csspart prev-month - Controls styles of previous month button
 * @csspart next-month - Controls styles of next month button
 * @csspart week-number - Controls styles of week numbers
 * @csspart day - Controls styles of day controls in the calendar
 * @csspart alt-month - Controls styles of days of previous and next month
 * @csspart day-today - Controls styles of current day
 * @csspart selected - Controls styles of selected day
 * @csspart day-label - Controls styles of day number label
 *
 * @event {CustomEvent} ks-focus - emits the date as short ISO string when calendar date is selected
 * @event {CustomEvent} ks-select - emits the date as short ISO string when calendar date is selected
 *
 */
@customElement('ks-calendar')
export class KsCalendar extends LitElement {
  static styles = styles;

  /** selected value */
  @property({ type: String, reflect: true })
  value?: string;

  /** the minimum selectable date */
  @property({ attribute: 'min-date', type: String })
  minDate?: string;

  /** the maximum selectable date */
  @property({ attribute: 'max-date', type: String })
  maxDate?: string;

  /** the initial focus date if no value is set */
  @property({ attribute: 'focus-date', type: String })
  focusDate?: string;

  /** comma separated list of disabled dates */
  @property({ attribute: 'disabled-dates', type: String })
  disabledDates?: string;

  /** show week numbers at the beginning of each week */
  @property({ attribute: 'show-week-numbers', type: Boolean })
  showWeekNumbers = false;

  /** comma separated list of week days to be disabled (1-7) */
  @property({ attribute: 'disabled-week-days', type: String })
  disabledWeekDays?: string;

  /** the day of the week the calendar will start with (0-6) */
  @property({ attribute: 'first-day-of-week', type: Number })
  firstDayOfWeek?: 0 | 1 | 2 | 3 | 4 | 5 | 6;

  /** label used for day input */
  @property({ attribute: 'day-label', type: String })
  dayLabel = 'Day';

  /** label used for month input */
  @property({ attribute: 'month-label', type: String })
  monthLabel = 'Month';

  /** label used for year input */
  @property({ attribute: 'year-label', type: String })
  yearLabel = 'Year';

  /** text for "Clear" button */
  @property({ attribute: 'clear-label', type: String })
  clearLabel = 'Clear';

  /** text for "Today" button */
  @property({ attribute: 'today-label', type: String })
  todayLabel = 'Today';

  @state()
  private _selectedDate?: Date;

  @state()
  private _selectedValue?: Date;

  @state()
  private _curDate: Date = new Date(Date.now());

  @state()
  private _selectedDay: number = this._curDate.getDay();

  @state()
  private _selectedMonth: number = this._curDate.getMonth();

  @state()
  private _selectedYear: number = this._curDate.getFullYear();

  @state()
  private _minDate: Date | null = null;

  @state()
  private _maxDate: Date | null = null;

  @state()
  private _formattedDisabledDates: string[] = [];

  @state()
  private _disabledWeekDaysList: number[] = [];

  @state()
  private $focusableEls: HTMLElement[] = [];

  @query('#year_selector')
  private $yearSelector?: HTMLInputElement;

  @watch('value', { waitUntilFirstUpdate: true })
  handleValueChange() {
    this.setSelectedDate();
    this.requestUpdate();
  }

  /**
   *
   * LIFECYCLE HOOKS
   *
   */

  protected willUpdate(
    _changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>
  ): void {
    if (_changedProperties.has('focusDate')) {
      this.initSelectedValues();
    }

    this.setMinMaxDates();
    this.setSelectedDateForRange();
  }

  protected firstUpdated(): void {
    this.setFormattedDisabledDates();
    this.setDisabledWeekDaysList();
  }

  /**
   *
   * EVENT EMITTERS
   *
   */

  private emitFocus() {
    const options = {
      detail: this.getEmittedData(),
      bubbles: true,
      composed: true,
    };
    this.dispatchEvent(new CustomEvent('ks-focus', options));
  }

  private emitSelected() {
    const fieldData = this.getEmittedData();
    const options = {
      detail: fieldData,
      bubbles: true,
      composed: true,
    };
    this.dispatchEvent(new CustomEvent('ks-select', options));
  }

  /**
   *
   * COMPONENT LOGIC
   *
   */

  private getEmittedData() {
    const isDateOutOfRange = this.value
      ? isOutOfRange(this._selectedDate as Date, this._minDate, this._maxDate)
      : false;
    const isDateUnavailable =
      this._formattedDisabledDates.includes(
        this._selectedDate?.toLocaleDateString() as string
      ) ||
      this._disabledWeekDaysList.includes(
        (this._selectedDate?.getDay() as number) + 1
      );

    const fieldData: FormFieldData = {
      value: getShortIsoDate(this._selectedDate as Date),
      valueAsDate: this._selectedDate,
      isValid: !isDateOutOfRange && !isDateUnavailable,
      validity: {
        outOfRange: isDateOutOfRange,
        valueMissing: false,
        dateUnavailable: isDateUnavailable,
      },
    };

    return fieldData;
  }

  private initSelectedValues() {
    this._selectedValue = this.value
      ? new Date(formatDateString(this.value))
      : this.focusDate
      ? new Date(formatDateString(this.focusDate))
      : this._curDate;
    this.setSelectedValues(this._selectedValue);
  }

  private setSelectedDate() {
    const selectedDate = this.value
      ? new Date(formatDateString(this.value))
      : this._selectedDate
      ? this._selectedDate
      : this._curDate;

    this.setSelectedValues(selectedDate);

    return selectedDate;
  }

  private pickDate(d: Date) {
    if (isOutOfRange(d, this._minDate, this._maxDate)) {
      return;
    }

    this.value = getShortIsoDate(d);
    this._selectedValue = d;
    this.selectDate(d);
    this.emitSelected();
  }

  private selectDate(date: Date) {
    this.setSelectedValues(date);
    this.setFocusableDate(date);
  }

  private setSelectedValues(date: Date) {
    this._selectedDate = date;
    this._selectedDay = date.getDate();
    this._selectedMonth = date.getMonth();
    this._selectedYear = date.getFullYear();
  }

  private setFocusableDate(date: Date) {
    setTimeout(() => {
      const $control = this.shadowRoot?.querySelector(
        `[id="${getShortIsoDate(date)}"]`
      ) as HTMLElement;

      this.$focusableEls.splice(4, 1, $control);

      this.resetDayButtons();
      $control?.setAttribute('aria-selected', 'true');
      $control?.setAttribute('tabindex', '0');
      $control?.focus();
    });
  }

  private resetDayButtons() {
    this.shadowRoot?.querySelectorAll('.day').forEach(x => {
      x.setAttribute('tabindex', '-1');
      x.setAttribute('aria-selected', 'false');
    });
  }

  private getLocale(): string {
    return this.lang
      ? this.lang
      : navigator.language || (navigator.languages || ['en'])[0];
  }

  private getFocusDate(): Date {
    return new Date(this._selectedYear, this._selectedMonth, this._selectedDay);
  }

  private setFormattedDisabledDates() {
    this._formattedDisabledDates =
      this.disabledDates
        ?.split(',')
        .map(x => new Date(formatDateString(x.trim())).toLocaleDateString()) ||
      [];
  }

  private setDisabledWeekDaysList() {
    this._disabledWeekDaysList =
      this.disabledWeekDays?.split(',').map(x => Number(x.trim())) || [];
  }

  private isDateDisabled(date: Date) {
    return (
      this._formattedDisabledDates.includes(date.toLocaleDateString()) ||
      isOutOfRange(date, this._minDate, this._maxDate) ||
      this._disabledWeekDaysList.includes(date.getDay() + 1)
    );
  }

  private updateYearSelector() {
    (this.$yearSelector as HTMLInputElement).value =
      this._selectedYear.toString();
  }

  private setMinMaxDates() {
    this._minDate = (
      this.minDate ? new Date(formatDateString(this.minDate)) : null
    ) as Date;

    this._maxDate = (
      this.maxDate ? new Date(formatDateString(this.maxDate)) : null
    ) as Date;
  }

  private setSelectedDateForRange() {
    if (
      this.maxDate &&
      this._selectedDate &&
      this._selectedDate.valueOf() > (this._maxDate as Date).valueOf()
    ) {
      this._selectedDate = this._maxDate as Date;
    }

    if (
      this.minDate &&
      this._selectedDate &&
      this._selectedDate.valueOf() < (this._minDate as Date).valueOf()
    ) {
      this._selectedDate = this._minDate as Date;
    }

    this.setSelectedValues(this._selectedDate ?? this._curDate);
  }

  private getSelectedMonthsDate(year: number, month: number) {
    const daysInSelectedMonth = getDaysInMonth(month, year);
    const nextDay =
      daysInSelectedMonth < this._selectedDay
        ? daysInSelectedMonth
        : this._selectedDay;

    return new Date(year, month, nextDay);
  }

  /**
   *
   * EVENT HANDLERS
   *
   */

  private handleDayKeyUp(day: Date, e: KeyboardEvent) {
    let newDate: Date = new Date();

    switch (e.key) {
      case 'ArrowUp':
        newDate = addDaysToDate(day, -7);
        break;
      case 'ArrowDown':
        newDate = addDaysToDate(day, 7);
        break;
      case 'ArrowLeft':
        newDate = addDaysToDate(day, -1);
        break;
      case 'ArrowRight':
        newDate = addDaysToDate(day, 1);
        break;
      case 'Enter':
        this.pickDate(day);
        return;
      case 'Escape':
        e.preventDefault();
        newDate = this._selectedValue ?? (this._curDate as Date);
        break;
      default:
        return;
    }

    if (isOutOfRange(newDate, this._minDate, this._maxDate)) {
      return;
    }

    this.selectDate(newDate);
    this.updateYearSelector();
    this.emitFocus();
  }

  private handleDayKeyDown(e: KeyboardEvent) {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Escape') {
      e.preventDefault();
    }

    if (
      e.key === 'Escape' &&
      this._selectedDate?.toLocaleDateString() !==
        this._selectedValue?.toLocaleDateString()
    ) {
      e.stopPropagation();
    }
  }

  private handleMonthChange(e: Event): void {
    const newMonth = parseInt((e.target as HTMLSelectElement).value);
    this._selectedMonth = newMonth;
    this._selectedDate = this.getFocusDate();

    this.emitFocus();
  }

  private handleYearInput(e: InputEvent): void {
    const newYear = parseInt((e.target as HTMLInputElement).value);
    this._selectedYear = newYear;
    this._selectedDate = this.getFocusDate();

    this.emitFocus();
  }

  private handlePrevMonthClick(): void {
    let nextDate =
      this._selectedMonth === 0
        ? this.getSelectedMonthsDate(this._selectedYear - 1, 11)
        : this.getSelectedMonthsDate(
            this._selectedYear,
            this._selectedMonth - 1
          );

    if (this.minDate) {
      nextDate = isOutOfRange(nextDate, this._minDate, this._maxDate)
        ? (this._minDate as Date)
        : nextDate;
    }

    this.setSelectedValues(nextDate);
    this.updateYearSelector();
    this.emitFocus();
  }

  private handleNextMonthClick(): void {
    let nextDate =
      this._selectedMonth === 11
        ? this.getSelectedMonthsDate(this._selectedYear + 1, 0)
        : this.getSelectedMonthsDate(
            this._selectedYear,
            this._selectedMonth + 1
          );

    if (this.maxDate) {
      nextDate = isOutOfRange(nextDate, this._minDate, this._maxDate)
        ? (this._maxDate as Date)
        : nextDate;
    }

    this.setSelectedValues(nextDate);
    this.updateYearSelector();
    this.emitFocus();
  }

  /**
   *
   * TEMPLATES AND RENDERING
   *
   */

  render() {
    return html` ${this.topControlsTemplate()} ${this.calendarTemplate()} `;
  }

  private topControlsTemplate() {
    return html`
      <div class="top-controls">
        <span class="left-controls">
          <label class="month-label">
            <span class="sr-only">${this.monthLabel}</span>
            <select
              id="month_selector"
              class="month-selector"
              part="input"
              @change="${this.handleMonthChange}"
            >
              ${getMonths(this.getLocale()).map(
                (month, i) => html`
                  <option value="${i}" ?selected="${i === this._selectedMonth}">
                    ${month}
                  </option>
                `
              )}
            </select>
            <span class="month-icon"> ${icon('chevron_down')} </span>
          </label>
          <label for="year_selector" class="sr-only">${this.yearLabel}</label>
          <input
            id="year_selector"
            class="year-selector"
            part="input"
            type="number"
            value="${this._selectedYear}"
            @input="${this.handleYearInput}"
          />
        </span>
        <span class="right-controls">
          <button
            class="arrow prev"
            part="button prev-month"
            @click="${this.handlePrevMonthClick}"
            aria-label="${getMonthLabel(
              this._selectedMonth - 1,
              this._selectedYear,
              this.getLocale()
            )}"
          >
            <slot name="prev-month-icon"> ${icon('arrow_up')} </slot>
          </button>
          <button
            class="arrow next"
            part="button next-month"
            @click="${this.handleNextMonthClick}"
            aria-label="${getMonthLabel(
              this._selectedMonth + 1,
              this._selectedYear,
              this.getLocale()
            )}"
          >
            <slot name="prev-month-icon"> ${icon('arrow_down')} </slot>
          </button>
        </span>
      </div>
    `;
  }

  private calendarTemplate() {
    return html`
      <table
        id="calendar_controls"
        class="calendar"
        role="grid"
        aria-multiselectable="false"
        aria-labelledby="calendar_header"
      >
        <caption id="calendar_header" class="sr-only">
          ${getMonthLabel(
            this._selectedMonth,
            this._selectedYear,
            this.getLocale()
          )}
        </caption>
        <thead role="rowgroup">
          <tr class="week-days" role="row">
            ${this.showWeekNumbers ? html`<th></th>` : ''}
            ${getDaysOfTheWeek(this.getLocale(), this.firstDayOfWeek).map(
              day =>
                html`<th
                  scope="col"
                  role="columnheader"
                  title="${day.fullDay}"
                  aria-label="${day.fullDay}"
                >
                  ${day.abbr}
                </th>`
            )}
          </tr>
        </thead>
        <tbody role="rowgroup">
          ${getWeeks(
            this._selectedMonth,
            this._selectedYear,
            this.firstDayOfWeek
          ).map(week => this.weekTemplate(week))}
        </tbody>
      </table>
    `;
  }

  private weekTemplate(week: Date[]) {
    return html`
      <tr class="week" role="row">
        ${this.showWeekNumbers
          ? html`<th class="week-number" part="week-number">
              ${getWeek(week[0])}
            </th>`
          : ''}
        ${week.map(day => this.dayTemplate(day))}
      </tr>
    `;
  }

  private dayTemplate(day: Date) {
    const isSelected =
      this._selectedDate?.toLocaleDateString() === day.toLocaleDateString();
    const isToday =
      this._curDate.toLocaleDateString() === day.toLocaleDateString();

    return html`
      <td
        id="${getShortIsoDate(day)}"
        role="gridcell"
        aria-selected="${isSelected}"
        class="day ${day.getMonth() !== this._selectedMonth ? 'alt-month' : ''}"
        part="day 
          ${day.getMonth() !== this._selectedMonth ? 'alt-month' : ''} 
          ${isToday ? 'day-today' : ''} 
          ${isSelected ? 'selected' : ''}"
        aria-label="${getFullDate(day, this.getLocale())}"
        aria-current="${isToday ? 'date' : false}"
        tabindex="${isSelected ? 0 : -1}"
        aria-disabled="${this.isDateDisabled(day)}"
        @keydown="${(e: KeyboardEvent) => this.handleDayKeyDown(e)}"
        @click="${() => this.pickDate(day)}"
        @keyup="${(e: KeyboardEvent) => this.handleDayKeyUp(day, e)}"
      >
        <span class="day-label" aria-hidden="true" part="day-label">
          ${day.getDate()}
        </span>
        <slot name="${getShortIsoDate(day)}"></slot>
      </td>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ks-calendar': KsCalendar;
  }
}
