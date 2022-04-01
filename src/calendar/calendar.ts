/* eslint-disable class-methods-use-this */
/* eslint-disable no-console */
import { html, LitElement } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { IFormFieldData } from '../datepicker';
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
} from '../utils/dateUtils';
import icon from '../utils/icons';
import { watch } from '../utils/watchDecorator';

import { styles } from './calendar.styles';

/**
 * @tag ks-calendar
 *
 * @summary Custom calendar element
 *
 * @attr {string} min-date - the minimum selectable date
 * @attr {string} max-date - the maximum selectable date
 * @attr {string} day-label - label used for day input
 * @attr {string} month-label - label used for month input
 * @attr {string} year-label - label used for year input
 * @attr {string} clear-label - text for clear button
 * @attr {string} today-label - text for today button
 * @attr {string} disabled-dates - comma separated list of disabled dates
 * @attr {boolean} show-week-numbers - show week numbers at the beginning of each week
 *
 * @slot prev-month-icon - icon in previous month button
 * @slot next-month-icon - icon in next month button
 *
 * @cssprop [--primary-color=#293d4e] - Primary color used in the component
 * @cssprop [--outline=solid 2px var(--outline-color)] - Default outline style
 * @cssprop [--outline-color=#71a5d1] - Outline color
 * @cssprop [--outline-offset=0.125rem] - Outline offset
 * @cssprop [--border-color=#596d7f] - Default border color
 * @cssprop [--day-hover-background-color=#e0e7f3] - Background color of days in calendar when hovered
 * @cssprop [--day-disabled-color=#ccc] - Color of disabled days
 *
 * @event {CustomEvent} ks-change - emits the date as short ISO string when calendar date is selected
 *
 */
@customElement('ks-calendar')
export class KsCalendar extends LitElement {
  static styles = styles;

  @property({ type: String, reflect: true })
  value?: string;

  @property({ attribute: 'min-date', type: String })
  minDate?: string;

  @property({ attribute: 'max-date', type: String })
  maxDate?: string;

  @property({ attribute: 'day-label', type: String })
  dayLabel = 'Day';

  @property({ attribute: 'month-label', type: String })
  monthLabel = 'Month';

  @property({ attribute: 'year-label', type: String })
  yearLabel = 'Year';

  @property({ attribute: 'clear-label', type: String })
  clearLabel = 'Clear';

  @property({ attribute: 'today-label', type: String })
  todayLabel = 'Today';

  @property({ attribute: 'disabled-dates', type: String })
  disabledDates?: string;

  @property({ attribute: 'show-week-numbers', type: Boolean })
  showWeekNumbers = false;

  @state()
  private _selectedDate?: Date;

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
  private $focusableEls: HTMLElement[] = [];

  @query('#year_selector')
  private $yearSelector?: HTMLInputElement;

  @query('#calendar_controls tbody')
  private $calendarControls?: HTMLElement;

  @watch('value', { waitUntilFirstUpdate: true })
  handleValueChange() {
    this.setSelectedDate();
  }

  /**
   *
   * LIFECYCLE HOOKS
   *
   */

  protected firstUpdated(): void {
    this.initSelectedValues();
    this.setFormattedDisabledDates();
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
    this.dispatchEvent(new CustomEvent('date-focused', options));
  }

  private emitSelected(reset = false) {
    const fieldData = this.getEmittedData();
    if (reset) {
      fieldData.value = undefined;
    }

    const options = {
      detail: fieldData,
      bubbles: true,
      composed: true,
    };
    this.dispatchEvent(new CustomEvent('date-selected', options));
  }

  /**
   *
   * COMPONENT LOGIC
   *
   */

  private getEmittedData() {
    const isDateOutOfRange = isOutOfRange(
      this._selectedDate as Date,
      this._minDate,
      this._maxDate
    );
    const isDateUnavailable = this._formattedDisabledDates.includes(
      this._selectedDate?.toLocaleDateString() as string
    );
    const fieldData: IFormFieldData = {
      value: getShortIsoDate(this._selectedDate as Date),
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
    const selectedDate = this.value
      ? new Date(formatDateString(this.value))
      : this._curDate;
    this.setSelectedValues(selectedDate);
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

  private setDateForToday(): void {
    this.pickDate(new Date());
  }

  private clearInput(): void {
    this.value = undefined;
    this._selectedDay = this._curDate.getDate();
    this._selectedMonth = this._curDate.getMonth();
    this._selectedYear = this._curDate.getFullYear();
    this._selectedDate = this.getFocusDate();
    this.emitSelected(true);
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

  private isDateDisabled(date: Date) {
    return (
      this._formattedDisabledDates.includes(date.toLocaleDateString()) ||
      isOutOfRange(date, this._minDate, this._maxDate)
    );
  }

  private updateYearSelector() {
    (this.$yearSelector as HTMLInputElement).value = this._selectedYear.toString();
  }

  /**
   *
   * EVENT HANDLERS
   *
   */

  private dayKeyUpHandler(day: Date, e: KeyboardEvent) {
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
        newDate = this.value
          ? new Date(formatDateString(this.value))
          : (this._curDate as Date);
        break;
      default:
        return;
    }

    this.updateYearSelector();
    this.selectDate(newDate);
    this.emitFocus();
  }

  private dayKeyDownHandler(e: KeyboardEvent) {
    if (e.key !== 'Tab') {
      e.preventDefault();
    }

    const selectedValue = this.value
      ? new Date(formatDateString(this.value))
      : (this._curDate as Date);
    if (
      e.key === 'Escape' &&
      this._selectedDate?.toLocaleDateString() !==
        selectedValue.toLocaleDateString()
    ) {
      e.stopPropagation();
    }
  }


  private monthChangeHandler(e: Event): void {
    const newMonth = parseInt((e.target as HTMLSelectElement).value);
    this._selectedMonth = newMonth;
    this._selectedDate = this.getFocusDate();

    this.emitFocus();
  }

  private yearInputHandler(e: InputEvent): void {
    const newYear = parseInt((e.target as HTMLInputElement).value);
    this._selectedYear = newYear;
    this._selectedDate = this.getFocusDate();

    this.emitFocus();
  }

  private prevMonthClickHandler(): void {
    if (this._selectedMonth === 0) {
      this._selectedMonth = 11;
      this._selectedYear--;
      this.updateYearSelector();
    } else {
      this._selectedMonth--;
    }

    this._selectedDate = this.getFocusDate();
    this.emitFocus();
  }

  private nextMonthClickHandler(): void {
    if (this._selectedMonth === 11) {
      this._selectedMonth = 0;
      this._selectedYear++;
      this.updateYearSelector();
    } else {
      this._selectedMonth++;
    }

    this._selectedDate = this.getFocusDate();
    this.emitFocus();
  }

  private beforeRender() {
    this._minDate = (
      this.minDate ? new Date(formatDateString(this.minDate)) : null
    ) as Date;

    this._maxDate = (
      this.maxDate ? new Date(formatDateString(this.maxDate)) : null
    ) as Date;
  }

  /**
   *
   * TEMPLATES AND RENDERING
   *
   */

  render() {
    this.beforeRender();

    return html`
      ${this.topControlsTemplate()} ${this.calendarTemplate()}
      ${this.bottomControlsTemplate()}
    `;
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
              @change="${this.monthChangeHandler}"
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
            type="number"
            value="${this._selectedYear}"
            @input="${this.yearInputHandler}"
          />
        </span>
        <span class="right-controls">
          <button
            class="arrow prev"
            @click="${this.prevMonthClickHandler}"
            aria-label="${getMonthLabel(
              this._selectedMonth - 1,
              this._selectedYear,
              this.getLocale()
            )}"
          >
            ${icon('arrow_up')}
          </button>
          <button
            class="arrow next"
            @click="${this.nextMonthClickHandler}"
            aria-label="${getMonthLabel(
              this._selectedMonth + 1,
              this._selectedYear,
              this.getLocale()
            )}"
          >
            ${icon('arrow_down')}
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
            ${getDaysOfTheWeek(this.getLocale()).map(
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
        <tbody role="rowgroup" class="show">
          ${getWeeks(this._selectedMonth, this._selectedYear).map(week =>
            this.weekTemplate(week)
          )}
        </tbody>
      </table>
    `;
  }

  private weekTemplate(week: Date[]) {
    return html`
      <tr class="week" role="row">
        ${this.showWeekNumbers ? html`<th class="week-number">${getWeek(week[0])}</th>` : ''}
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
        class="day ${day.getMonth() !== this._selectedMonth
          ? 'other-month'
          : ''}"
        aria-label="${getFullDate(day, this.getLocale())}"
        aria-current="${isToday ? 'date' : false}"
        tabindex="${isSelected ? 0 : -1}"
        aria-disabled="${this.isDateDisabled(day)}"
        @keydown="${(e: KeyboardEvent) => this.dayKeyDownHandler(e)}"
        @click="${() => this.pickDate(day)}"
        @keyup="${(e: KeyboardEvent) => this.dayKeyUpHandler(day, e)}"
      >
        <span aria-hidden="true">${day.getDate()}</span>
      </td>
    `;
  }

  private bottomControlsTemplate() {
    return html`
      <div class="bottom-controls">
        <button class="clear" @click="${this.clearInput}">
          ${this.clearLabel}
        </button>
        <button class="today" @click="${this.setDateForToday}">
          ${this.todayLabel}
        </button>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ks-calendar': KsCalendar;
  }
}
