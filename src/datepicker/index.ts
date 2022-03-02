/* eslint-disable class-methods-use-this */
/* eslint-disable no-console */
import { html, LitElement, TemplateResult } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";

import { getFocusableElements } from "../utils/domUtils";
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
  isValidDate,
  getDaysInMonth,
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
 * @attr {string} day-label - label used for day input
 * @attr {string} month-label - label used for month input
 * @attr {string} year-label - label used for year input
 * @attr {string} clear-label - text for clear button
 * @attr {string} today-label - text for today button
 *
 * @slot calendar-icon - icon in button toggle for date selector
 * @slot prev-month-icon - icon in previous month button
 * @slot next-month-icon - icon in next month button
 *
 * @cssprop [--font-size=1rem] - Controls the font size for all elements in the component
 * @cssprop [--padding=0.25rem] - Controls the padding for the `input` and `button` elements
 *
 * @event {CustomEvent} ks-change - emits the date as short ISO string when calendar date is selected
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
  private _selectedDay: number = this._curDate.getDay();

  @state()
  private _selectedMonth: number = this._curDate.getMonth();

  @state()
  private _selectedYear: number = this._curDate.getFullYear();

  @state()
  private _focusIndex = 0;

  @state()
  private _minDate: Date | null = null;

  @state()
  private _maxDate: Date | null = null;

  @state()
  private $focusableEls: HTMLElement[] = [];

  @query("#day")
  private $dayInput: HTMLInputElement | undefined;

  @query("#month")
  private $monthInput: HTMLInputElement | undefined;

  @query("#year")
  private $yearInput: HTMLInputElement | undefined;

  @query('.calendar [tabindex="0"]')
  private $calendarFocusableButton: HTMLButtonElement | undefined;

  @query("#calendar-dropdown")
  private $calendar: HTMLElement | undefined;

  protected firstUpdated(): void {
    this.hideOnDocumentClick();
  }

  /**
   *
   * PUBLIC METHODS
   *
   */

  public show(): void {
    this.$focusableEls = getFocusableElements(this.$calendar);
    this._expanded = true;
    this._focusIndex = 4;
    setTimeout(() => this.$calendarFocusableButton?.focus(), 200);
  }

  public hide(): void {
    this._expanded = false;
    this._focusIndex = 4;
    setTimeout(() => this.$monthInput?.focus());
  }

  /**
   *
   * COMPONENT LOGIC
   *
   */

  private hideOnDocumentClick() {
    window.addEventListener("click", (e: MouseEvent) => {
      if (this.contains(e.target as HTMLElement)) {
        return;
      }

      this._expanded = false;
    });
  }

  private getSelectedDate() {
    return this._selectedDate
      ? this._selectedDate
      : this.value
      ? new Date(this.value as string)
      : this._curDate;
  }

  private pickDate(d: Date) {
    if (isOutOfRange(d, this._minDate, this._maxDate)) {
      return;
    }
    this.selectDate(d);
    this.emitChange();
    this.hide();
  }

  private emitChange() {
    const options = {
      detail: { value: getShortIsoDate(this._selectedDate as Date) },
      bubbles: true,
      composed: true,
    };
    this.dispatchEvent(new CustomEvent("ks-change", options));
  }

  private selectDate(date: Date) {
    // if (!this.$input) {
    //   return;
    // }

    this.value = date.toLocaleDateString(this.getLocale());
    // this.$input.value = this.value;
    this._selectedDate = date;
    this._selectedMonth = date.getMonth();
    this._selectedYear = date.getFullYear();
    this.setFocusableDate(date);
  }

  private setFocusableDate(date: Date) {
    setTimeout(() => {
      const $control = this.$calendar?.querySelector(
        `[id="${getShortIsoDate(date)}"]`
      ) as HTMLButtonElement;
      this.$focusableEls.splice(4, 1, $control);

      this.resetDayButtons();
      $control?.setAttribute("tabindex", "0");
      $control?.setAttribute("aria-select", "true");
      $control?.focus();
    });
  }

  private resetDayButtons() {
    this.$calendar?.querySelectorAll("table button").forEach((x) => {
      x.setAttribute("tabindex", "-1");
      x.setAttribute("aria-selected", "false");
    });
  }

  private toggleCalendar() {
    if (!this._expanded) {
      this.show();
    } else {
      this.hide();
    }
  }

  private getLocale(): string {
    return this.locale
      ? this.locale
      : navigator.language || (navigator.languages || ["en"])[0];
  }

  private setDateForToday(): void {
    this.pickDate(new Date());
  }

  private clearInput(): void {
    (this.$dayInput as HTMLInputElement).value = "";
    (this.$monthInput as HTMLInputElement).value = "";
    (this.$yearInput as HTMLInputElement).value = "";

    this.hide();
  }

  private getFocusDate(): Date {
    return isOutOfRange(
      this._selectedDate as Date,
      this._minDate,
      this._maxDate
    )
      ? (this._minDate as Date)
      : (this._selectedDate as Date);
  }

  /**
   *
   * EVENT HANDLERS
   *
   */

  private dayKeyUpHandler(day: Date, e: KeyboardEvent) {
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
        this.pickDate(day);
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

    this.selectDate(newDate);
  }

  private inputControlClickHandler() {
    this.toggleCalendar();
  }

  private dropdownMonthChangeHandler(e: Event): void {
    this._selectedMonth = +(e.target as HTMLSelectElement).value;
    this._focusIndex = 0;
  }

  private dropdownYearInputHandler(e: InputEvent): void {
    this._selectedYear = +(e.target as HTMLInputElement).value;
    this._focusIndex = 1;
  }

  private prevMonthClickHandler(): void {
    if (this._selectedMonth === 0) {
      this._selectedMonth = 11;
      this._selectedYear -= 1;
    } else {
      this._selectedMonth -= 1;
    }
    this._focusIndex = 2;
  }

  private nextMonthClickHandler(): void {
    if (this._selectedMonth === 11) {
      this._selectedMonth = 0;
      this._selectedYear += 1;
    } else {
      this._selectedMonth += 1;
    }
    this._focusIndex = 3;
  }

  private mainInputHandler(e: KeyboardEvent) {
    const inputDate = new Date(
      formatDateString((e.target as HTMLInputElement).value)
    );

    if (!isValidDate(inputDate)) {
      return;
    }

    this._selectedDate = inputDate;
    this._selectedMonth = this._selectedDate.getMonth();
    this._selectedYear = this._selectedDate.getFullYear();
  }

  private dropdownKeyDownHandler(e: KeyboardEvent): void {
    switch (e.key) {
      case "Tab":
        this.dropdownTabHandler(e);
        break;
      case "Escape":
        this.dropdownEscKeyHandler();
        break;
      default:
        break;
    }
  }

  private dropdownTabHandler(e: KeyboardEvent): void {
    e.preventDefault();

    if (e.shiftKey) {
      this.dropdownBackwardTabHandler();
    } else {
      this.dropdownForwardTabHandler();
    }
  }

  private dropdownBackwardTabHandler(): void {
    this._focusIndex =
      this._focusIndex === 0
        ? this.$focusableEls.length - 1
        : --this._focusIndex;
    this.$focusableEls[this._focusIndex]?.focus();
  }

  private dropdownForwardTabHandler(): void {
    this._focusIndex =
      this.$focusableEls.length - 1 === this._focusIndex
        ? 0
        : ++this._focusIndex;
    this.$focusableEls[this._focusIndex].focus();
  }

  private dropdownEscKeyHandler(): void {
    this.hide();
  }

  private labelClickHandler() {
    this.$monthInput?.select();
  }

  private mainMonthKeyUpHandler(e: KeyboardEvent) {
    switch (e.key) {
      case "ArrowRight":
        this.$dayInput?.select();
        break;
      case " ":
        this.show();
        break;
      default:
        return;
    }
  }

  private mainMonthInputHandler() {
    const value = this.$monthInput?.value;

    if (value) {
      this._selectedMonth = Number(value);
      console.log(this._selectedMonth);

      if (this._selectedMonth > 1) {
        this.$dayInput?.select();
      }
    }
  }

  private mainDayKeyUpHandler(e: KeyboardEvent) {
    switch (e.key) {
      case "ArrowLeft":
        this.$monthInput?.select();
        break;
      case "ArrowRight":
        this.$yearInput?.select();
        break;
      case " ":
        this.show();
        break;
      default:
        return;
    }
  }

  private mainDayInputHandler() {
    const value = this.$dayInput?.value;

    if (value) {
      this._selectedDay = Number(value);

      if (this._selectedDay > 3) {
        this.$yearInput?.select();
      }
    }
  }

  private mainYearKeyUpHandler(e: KeyboardEvent) {
    switch (e.key) {
      case "ArrowLeft":
        this.$dayInput?.select();
        break;
      case " ":
        this.show();
        break;
      default:
        return;
    }
  }

  private mainYearInputHandler() {
    const value = this.$yearInput?.value;

    if (value) {
      this._selectedYear = Number(value);
    }
  }

  private onRender() {
    this._minDate = (
      this.minDate ? new Date(formatDateString(this.minDate)) : null
    ) as Date;

    this._maxDate = (
      this.maxDate ? new Date(formatDateString(this.maxDate)) : null
    ) as Date;

    this._selectedDate = this.getSelectedDate();
  }

  /**
   *
   * TEMPLATES AND RENDERING
   *
   */

  render(): TemplateResult {
    this.onRender();

    return html`
      ${this.mainInputTemplate()}
      <div
        id="calendar-dropdown"
        class="${classMap({ "calendar-dropdown": true, open: this._expanded })}"
        role="dialog"
        aria-label="${getMonthLabel(
          this._selectedMonth,
          this._selectedYear,
          this.getLocale()
        )}"
        @keydown="${this.dropdownKeyDownHandler}"
      >
        ${this.topControlsTemplate()} ${this.calendarTemplate()}
        ${this.bottomControlsTemplate()}
      </div>
    `;
  }

  private mainInputTemplate() {
    return html`
      <div class="controls">
        <fieldset class="main-input">
          <legend class="main-input-label" @click="${this.labelClickHandler}">
            ${this.label}
          </legend>
          <div class="main-input-controls">
            <label for="month" class="sr-only">${this.monthLabel}</label>
            <input
              id="month"
              class="month"
              type="number"
              min="1"
              max="12"
              placeholder="mm"
              @keyup="${this.mainMonthKeyUpHandler}"
              @input="${this.mainMonthInputHandler}"
            />
            <span aria-hidden="true">/</span>
            <label for="day" class="sr-only">${this.dayLabel}</label>
            <input
              id="day"
              class="day"
              type="number"
              min="1"
              max="${getDaysInMonth(this._selectedMonth, this._selectedYear)}"
              placeholder="dd"
              @keyup="${this.mainDayKeyUpHandler}"
              @input="${this.mainDayInputHandler}"
            />
            <span aria-hidden="true">/</span>
            <label for="year" class="sr-only">${this.yearLabel}</label>
            <input
              id="year"
              class="year"
              type="number"
              min="1"
              max="9999"
              placeholder="yyyy"
              @keyup="${this.mainYearKeyUpHandler}"
              @input="${this.mainYearInputHandler}"
            />
            <button
              class="calendar-toggle"
              aria-haspopup="true"
              aria-expanded=${this._expanded}
              aria-controls="calendar-dropdown"
              @click="${this.inputControlClickHandler}"
            >
              <svg
                class="icon"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                aria-label="calendar"
              >
                <g
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-width="1.5"
                >
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
        </fieldset>
      </div>
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
              @change="${this.dropdownMonthChangeHandler}"
            >
              ${getMonths(this.getLocale()).map(
                (month, i) => html`
                  <option value="${i}" ?selected="${i === this._selectedMonth}">
                    ${month}
                  </option>
                `)}
            </select>
            <span class="month-icon">
                <svg class="icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-label="chevron_down"><g><path d="m6 9 6 6 6-6" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></g></svg>
            </span>
          </label>
          <label for="year_selector" class="sr-only">${this.yearLabel}</label>
          <input
            id="year_selector"
            class="year-selector"
            type="number"
            .value="${this._selectedYear}"
            @input="${this.dropdownYearInputHandler}"
          />
        </span>
        <span class="right-controls">
          <button
            class="arrow"
            @click="${this.prevMonthClickHandler}"
            aria-label="${getMonthLabel(
              this._selectedMonth - 1,
              this._selectedYear,
              this.getLocale()
            )}"
          >
            <svg class="icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"><path d="m16 9-4-4-4 4" stroke-linejoin="round"></path><path d="M12 5.277V20"></path></g></svg>       
          </button>
          <button
            class="arrow"
            @click="${this.nextMonthClickHandler}"
            aria-label="${getMonthLabel(
              this._selectedMonth + 1,
              this._selectedYear,
              this.getLocale()
            )}"
          >
          <svg class="icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"><path d="m8 15 4 4 4-4" stroke-linejoin="round"></path><path d="M12 18.723V4"></path></g></svg>          </button>
        </span>
      </div
    `;
  }

  private calendarTemplate() {
    const focusDate = this.getFocusDate();

    return html`
      <table
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
            ${getDaysOfTheWeek(this.getLocale()).map(
              (day) =>
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
          ${getWeeks(this._selectedMonth, this._selectedYear).map((week) =>
            this.weekTemplate(week, focusDate)
          )}
        </tbody>
      </table>
    `;
  }

  private weekTemplate(week: Date[], focusDate: Date | null | undefined) {
    return html`
      <tr class="week" role="row">
        ${week.map((day) => this.dayTemplate(day, focusDate))}
      </tr>
    `;
  }

  private dayTemplate(day: Date, focusDate: Date | null | undefined) {
    const isSelected =
      focusDate?.toLocaleDateString() === day.toLocaleDateString();
    const isToday =
      this._curDate.toLocaleDateString() === day.toLocaleDateString();

    return html`
      <td class="day" role="gridcell" aria-selected="${isSelected}">
        <button
          id="${getShortIsoDate(day)}"
          class="${day.getMonth() !== this._selectedMonth ? "other-month" : ""}"
          aria-label="${getFullDate(day, this.getLocale())}"
          aria-current="${isToday ? "date" : false}"
          tabindex="${isSelected ? 0 : -1}"
          ?disabled="${isOutOfRange(day, this._minDate, this._maxDate)}"
          @click="${() => this.pickDate(day)}"
          @keyup="${(e: KeyboardEvent) => this.dayKeyUpHandler(day, e)}"
        >
          ${day.getDate()}
        </button>
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
    "ks-datepicker": KsDatepicker;
  }
}
