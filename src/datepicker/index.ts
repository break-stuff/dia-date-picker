/* eslint-disable class-methods-use-this */
/* eslint-disable no-console */
import { html, LitElement, TemplateResult } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";

import { getFocusableElements } from "../utils/domUtils";
import {
  addDaysToDate,
  getDaysOfTheWeek,
  getMonths,
  getWeeks,
  isOutOfRange,
} from "../utils/dateUtils";

import { styles } from "./datepicker.styles";

/**
 * @tag ks-datepicker
 *
 * @summary Custom date picker
 *
 * @attr {string} value - the date entered in the main input
 * @attr {string} label - label for main date input
 * @attr {string} locale - manual configuration for setting locale
 * @attr {string} min-date - the minimum selectable date
 * @attr {string} max-date - the maximum selectable date
 * @attr {string} day-label - the maximum selectable date
 *
 * @slot default - content displayed in the search button
 *
 * @cssprop [--font-size=1rem] - Controls the font size for all elements in the component
 * @cssprop [--padding=0.25rem] - Controls the padding for the `input` and `button` elements
 *
 */
@customElement("ks-datepicker")
export class KsDatepicker extends LitElement {
  static styles = styles;

  @property({ type: String, reflect: true })
  value: string | undefined;

  @property({ type: String })
  label: string | undefined;

  @property({ type: String })
  locale: string | undefined;

  @property({ attribute: "min-date", type: String })
  minDate: string | undefined;

  @property({ attribute: "max-date", type: String })
  maxDate: string | undefined;

  @property({ attribute: "day-label", type: String })
  dayLabel = "Day";

  @property({ attribute: "month-label", type: String })
  monthLabel = "Month";

  @property({ attribute: "year-label", type: String })
  yearLabel = "Year";

  @property({ attribute: "clear-label", type: String })
  clearLabel = "Clear";

  @property({ attribute: "today-label", type: String })
  todayLabel = "Today";

  @state()
  private _expanded = false;

  @state()
  private _selectedDate: Date | undefined;

  @state()
  private _curDate: Date = new Date(Date.now());

  @state()
  private _curMonth: number = this._curDate.getMonth();

  @state()
  private _curYear: number = this._curDate.getFullYear();

  @state()
  private _focusIndex = 0;

  @state()
  private _minDate: Date | null = null;

  @state()
  private _maxDate: Date | null = null;

  @state()
  private $focusableEls: HTMLElement[] = [];

  @query("#date-input")
  private $input: HTMLInputElement | undefined;

  @query('.calendar [tabindex="0"]')
  private $calendarFocusableButton: HTMLButtonElement | undefined;

  @query("#calendar-dropdown")
  private $calendar: HTMLElement | undefined;

  protected firstUpdated(): void {
    window.addEventListener("click", (e: MouseEvent) => {
      if (this.contains(e.target as HTMLElement)) {
        return;
      }

      this._expanded = false;
    });
  }

  public show(): void {
    this.$focusableEls = getFocusableElements(this.$calendar);
    this._expanded = true;
    this._focusIndex = 4;
    setTimeout(() => this.$calendarFocusableButton?.focus(), 200);
  }

  public hide(): void {
    this._expanded = false;
    this._focusIndex = 4;
    setTimeout(() => this.$input?.focus());
  }

  private _pickDate(d: Date) {
    if (isOutOfRange(d, this._minDate, this._maxDate)) {
      return;
    }
    this._selectDate(d);
    this._selectedDate = d;
    this.hide();
  }

  private _selectDate(date: Date) {
    if (!this.$input) {
      return;
    }

    this.value = date.toLocaleDateString(this._getLocale());
    this.$input.value = this.value;
    this._curMonth = date.getMonth();
    this._curYear = date.getFullYear();
    this._updateDateButton(date);
  }

  private _updateDateButton(date: Date) {
    setTimeout(() => {
      const $control = this.$calendar?.querySelector(
        `[id="${this._getShortDate(date)}"]`
      ) as HTMLButtonElement;
      this.$focusableEls.splice(4, 1, $control);

      this._resetDayButtons();
      $control?.setAttribute("tabindex", "0");
      $control?.setAttribute("aria-select", "true");
      $control?.focus();
    });
  }

  private _resetDayButtons() {
    this.$calendar?.querySelectorAll("table button").forEach((x) => {
      x.setAttribute("tabindex", "-1");
      x.setAttribute("aria-selected", "false");
    });
  }

  private _getShortDate(date: Date) {
    return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
  }

  private _dayKeyUpHandler(day: Date, e: KeyboardEvent) {
    let newDate: Date = new Date();
    switch (e.key) {
      case "ArrowUp":
        newDate = addDaysToDate(day, -7);
        break;
      case "ArrowDown":
        newDate = addDaysToDate(day, 7);
        break;
      case "ArrowLeft":
        newDate = addDaysToDate(day, -1);
        break;
      case "ArrowRight":
        newDate = addDaysToDate(day, 1);
        break;
      case "Enter":
        this._pickDate(day);
        break;
      case "Escape":
        e.preventDefault();
        if (
          day.toLocaleDateString() === this._selectedDate?.toLocaleDateString()
        ) {
          this.hide();
        }

        newDate = this._curDate as Date;
        break;
      default:
        return;
    }

    if (isOutOfRange(newDate, this._minDate, this._maxDate)) {
      return;
    }

    this._selectDate(newDate);
  }

  private _inputControlClickHandler() {
    this._toggleCalendar();
  }

  private _toggleCalendar() {
    if (!this._expanded) {
      this.show();
    } else {
      this.hide();
    }
  }

  private _getLocale(): string {
    return this.locale
      ? this.locale
      : navigator.language || (navigator.languages || ["en"])[0];
  }

  private _getPrevMonthLabel(): string {
    const locale = this._getLocale();
    const { format } = new Intl.DateTimeFormat(locale, {
      month: "long",
      year: "numeric",
    });
    return format(new Date(Date.UTC(this._curYear, this._curMonth)));
  }

  private _getNextMonthLabel(): string {
    const locale = this._getLocale();
    const { format } = new Intl.DateTimeFormat(locale, {
      month: "long",
      year: "numeric",
    });
    return format(new Date(Date.UTC(this._curYear, this._curMonth + 1)));
  }

  private _monthChangeHandler(e: Event): void {
    this._curMonth = +(e.target as HTMLSelectElement).value;
    this._focusIndex = 0;
  }

  private _yearInputHandler(e: InputEvent): void {
    this._curYear = +(e.target as HTMLInputElement).value;
    this._focusIndex = 1;
  }

  private _prevMonthClickHandler(): void {
    if (this._curMonth === 0) {
      this._curMonth = 11;
      this._curYear -= 1;
    } else {
      this._curMonth -= 1;
    }
    this._focusIndex = 2;
  }

  private _nextMonthClickHandler(): void {
    if (this._curMonth === 11) {
      this._curMonth = 0;
      this._curYear += 1;
    } else {
      this._curMonth += 1;
    }
    this._focusIndex = 3;
  }

  private _formatDate(date: Date): string {
    const locale = this._getLocale();
    const formatter = new Intl.DateTimeFormat(locale, { dateStyle: "full" });
    return formatter.format(date);
  }

  private _setDateForToday(): void {
    this._pickDate(new Date());
  }

  private _clearInput(): void {
    if (this.$input) this.$input.value = "";

    this.hide();
  }

  private _keyDownHandler(e: KeyboardEvent): void {
    switch (e.key) {
      case "Tab":
        this._handleTab(e);
        break;
      case "Escape":
        this._handleEsc();
        break;
      default:
        break;
    }
  }

  private _handleTab(e: KeyboardEvent): void {
    e.preventDefault();

    if (e.shiftKey) {
      this._handleBackwardTab();
    } else {
      this._handleForwardTab();
    }
  }

  private _handleBackwardTab(): void {
    this._focusIndex =
      this._focusIndex === 0
        ? this.$focusableEls.length - 1
        : --this._focusIndex;
    this.$focusableEls[this._focusIndex]?.focus();
  }

  private _handleForwardTab(): void {
    this._focusIndex =
      this.$focusableEls.length - 1 === this._focusIndex
        ? 0
        : ++this._focusIndex;
    this.$focusableEls[this._focusIndex].focus();
  }

  private _handleEsc(): void {
    this.hide();
  }

  private _onRender() {
    this._minDate = (this.minDate ? new Date(this.minDate) : null) as Date;
    this._maxDate = (this.maxDate ? new Date(this.maxDate) : null) as Date;
    this._selectedDate = this.value
      ? new Date(this.value as string)
      : this._curDate;
  }

  render(): TemplateResult {
    this._onRender();

    return html`
      ${this._mainInputTemplate()}
      <div
        id="calendar-dropdown"
        class="${classMap({ "calendar-dropdown": true, open: this._expanded })}"
        role="dialog"
        @keydown="${this._keyDownHandler}"
      >
        ${this._topControlsTemplate()} ${this._calendarTemplate()}
        ${this._bottomControlsTemplate()}
      </div>
    `;
  }

  private _mainInputTemplate() {
    return html`
      ${this.label &&
      html`<label for="date-input" class="main-input-label"
        >${this.label}</label
      >`}

      <div class="controls">
        <input
          id="date-input"
          class="main-input"
          type="text"
          value="${this.value}"
          @input="updatePickedDate($event.target.value)"
          @focus="${this.hide}"
        />
        <button
          class="calendar-toggle"
          aria-haspopup="true"
          aria-expanded=${this._expanded}
          aria-controls="calendar"
          @click="${this._inputControlClickHandler}"
        >
          <svg
            class="icon"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            aria-label="calendar"
          >
            <g stroke="currentColor" stroke-linecap="round" stroke-width="1.5">
              <g fill="none" stroke-linejoin="round">
                <path d="M4 7h16v13H4z" stroke="none"></path>
                <path d="M4.75 7.75h14.5v11.5H4.75z"></path>
              </g>
              <g fill="currentColor" stroke-linejoin="round">
                <path d="M4 8h16v2H4z" stroke="none"></path>
                <path fill="none" d="M4.75 8.75h14.5v.5H4.75z"></path>
              </g>
              <path fill="none" d="M8 13h8m-8 3h6M8 8V5m8 3V5"></path>
            </g>
          </svg>
        </button>
      </div>
    `;
  }

  private _topControlsTemplate() {
    return html`
      <div class="top-controls">
        <span class="left-controls">
          <label for="month_selector" class="sr-only">${this.monthLabel}</label>
          <select
            id="month_selector"
            class="month-selector"
            @change="${this._monthChangeHandler}"
          >
            ${getMonths(this._getLocale()).map(
              (month, i) => html`
                <option value="${i}" ?selected="${i === this._curMonth}">
                  ${month}
                </option>
              `
            )}
          </select>
          <label for="year_selector" class="sr-only">${this.yearLabel}</label>
          <input
            id="year_selector"
            class="year-selector"
            type="number"
            .value="${this._curYear}"
            @input="${this._yearInputHandler}"
          />
        </span>
        <span class="right-controls">
          <button
            class="arrow"
            @click="${this._prevMonthClickHandler}"
            aria-label="${this._getPrevMonthLabel()}"
          >
            <svg class="icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-label="arrow_up"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"><path d="M17.415 11.915 12 6.5l-5.416 5.415" stroke-linejoin="round"></path><path d="M12 7.338V17.5"></path></g></svg>          
          </button>
          <button
            class="arrow"
            @click="${this._nextMonthClickHandler}"
            aria-label="${this._getNextMonthLabel()}"
          >
            <svg class="icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-label="arrow_down"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"><path d="M6.585 12.085 12 17.5l5.416-5.415" stroke-linejoin="round"></path><path d="M12 16.662V6.5"></path></g></svg>
          </button>
        </span>
      </div
    `;
  }

  private _calendarTemplate() {
    const focusDate = isOutOfRange(
      this._selectedDate as Date,
      this._minDate,
      this._maxDate
    )
      ? this._minDate
      : this._selectedDate;

    return html`
      <table class="calendar">
        <thead>
          <tr class="week-days">
            ${getDaysOfTheWeek(this._getLocale()).map(
              (day) => html`<td>${day}</td>`
            )}
          </tr>
        </thead>
        <tbody>
          ${getWeeks(this._curMonth, this._curYear).map((week) =>
            this._weekTemplate(week, focusDate)
          )}
        </tbody>
      </table>
    `;
  }

  private _weekTemplate(week: Date[], focusDate: Date | null | undefined) {
    return html`
      <tr class="week">
        ${week.map((day) => this._dayTemplate(day, focusDate))}
      </tr>
    `;
  }

  private _dayTemplate(day: Date, focusDate: Date | null | undefined) {
    const isSelected =
      focusDate?.toLocaleDateString() === day.toLocaleDateString();
    const isToday =
      this._curDate.toLocaleDateString() === day.toLocaleDateString();

    return html`
      <td class="day">
        <button
          id="${this._getShortDate(day)}"
          class="${day.getMonth() !== this._curMonth ? "other-month" : ""}"
          aria-label="${this._formatDate(day)}"
          aria-selected="${isSelected}"
          aria-current="${isToday ? "date" : false}"
          tabindex="${isSelected ? 0 : -1}"
          ?disabled="${isOutOfRange(day, this._minDate, this._maxDate)}"
          @click="${() => this._pickDate(day)}"
          @keyup="${(e: KeyboardEvent) => this._dayKeyUpHandler(day, e)}"
        >
          ${day.getDate()}
        </button>
      </td>
    `;
  }

  private _bottomControlsTemplate() {
    return html`
      <div class="bottom-controls">
        <button class="clear" @click="${this._clearInput}">
          ${this.clearLabel}
        </button>
        <button class="today" @click="${this._setDateForToday}">
          ${this.todayLabel}
        </button>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ks-datepicker": KsDatepicker;
  }
}
