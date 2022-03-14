/* eslint-disable class-methods-use-this */
/* eslint-disable no-console */
import { html, LitElement } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import '../calendar';

import { getFocusableElements } from '../utils/domUtils';
import {
  getShortIsoDate,
  isOutOfRange,
  getMonthLabel,
  formatDateString,
  getDaysInMonth,
} from '../utils/dateUtils';

import { styles } from './datepicker.styles';

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
@customElement('ks-datepicker')
export class KsDatepicker extends LitElement {
  static styles = styles;

  @property({ type: String, reflect: true })
  value?: string;

  @property({ type: String })
  label?: string;

  @property({ type: Boolean })
  required = false;

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

  @property({ attribute: 'required-error-message', type: String })
  requiredErrorMessage = 'This field is required';

  @property({ attribute: 'range-error-message', type: String })
  rangeErrorMessage = 'The date you have selected is unavailable';

  @state()
  private _expanded = false;

  @state()
  private _isValid = true;

  @state()
  private errorMessage = this.requiredErrorMessage;

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
  private $calendarFocusableElements?: HTMLElement[];

  @state()
  private $calendarFirstElement?: HTMLElement;

  @state()
  private $calendarLastElement?: HTMLElement;

  @query('#day')
  private $dayInput?: HTMLInputElement;

  @query('#month')
  private $monthInput?: HTMLInputElement;

  @query('#year')
  private $yearInput?: HTMLInputElement;

  @query('ks-calendar')
  private $calendar?: HTMLElement;

  /**
   *
   * LIFECYCLE HOOKS
   *
   */

  protected firstUpdated(): void {
    this.onComponentBlur();
    this.initMainInputValues();
    setTimeout(() => this.setCalendarElementVariables());
  }

  protected async performUpdate() {
    // update selected values when value changes
    setTimeout(() => this.updateMainInputValues());
    return super.performUpdate();
  }

  /**
   *
   * PUBLIC METHODS
   *
   */

  public show(): void {
    this._expanded = true;
    this.setDayFocus();
  }

  public hide(): void {
    this._expanded = false;
    setTimeout(() => this.$monthInput?.focus());
  }

  /**
   *
   * EVENT EMITTERS
   *
   */

  private emitInput() {
    if (
      !this.$dayInput?.value ||
      !this.$monthInput?.value ||
      !this.$yearInput?.value
    ) {
      return;
    }

    this.updateSelectedDate();
    this.value = getShortIsoDate(this._selectedDate as Date);

    const options = {
      detail: { value: this.value },
      bubbles: true,
      composed: true,
    };

    this.dispatchEvent(new CustomEvent('ks-input', options));
  }

  /**
   *
   * COMPONENT LOGIC
   *
   */

  private initMainInputValues() {
    const selectedDate = this.value
      ? new Date(formatDateString(this.value))
      : this._curDate;
    this.setSelectedValues(selectedDate);

    if (this.value) {
      this.setInputValues();
    }
  }

  private updateMainInputValues() {
    if (!this.value) {
      return;
    }

    const valueDate = new Date(formatDateString(this.value));

    if (
      valueDate.toLocaleDateString() ===
      this._selectedDate?.toLocaleDateString()
    ) {
      return;
    }

    this.setSelectedValues(valueDate);
  }

  private onComponentBlur() {
    window.addEventListener('click', (e: MouseEvent) => {
      if (this.contains(e.target as HTMLElement)) {
        return;
      }

      this._expanded = false;
      this.validate();
    });
  }

  private setDayFocus() {
    setTimeout(
      () =>
        (
          this.$calendar?.shadowRoot?.querySelector(
            `.day[aria-selected="true"]`
          ) as HTMLElement
        )?.focus(),
      200
    );
  }

  private getSelectedDate() {
    return this.value
      ? new Date(this.value as string)
      : this._selectedDate
      ? this._selectedDate
      : this._curDate;
  }

  private updateSelectedDate() {
    this._selectedDate = new Date(
      this._selectedYear,
      this._selectedMonth,
      this._selectedDay
    );
  }

  private setSelectedValues(date: Date) {
    this._selectedDate = date;
    this._selectedDay = date.getDate();
    this._selectedMonth = date.getMonth();
    this._selectedYear = date.getFullYear();
  }

  setInputValues() {
    if (!this.$dayInput) {
      return;
    }

    this.setMainDayInput();
    this.setMainMonthInput();
    this.setMainYearInput();
  }

  resetInputValues() {
    if (!this.$dayInput) {
      return;
    }

    this.setMainDayInput('');
    this.setMainMonthInput('');
    this.setMainYearInput('');
  }

  private toggleCalendar() {
    if (!this._expanded) {
      this.show();
    } else {
      this.hide();
    }
  }

  private getLocale(): string {
    return this.lang
      ? this.lang
      : navigator.language || (navigator.languages || ['en'])[0];
  }

  private setMainDayInput(day: number | string = this._selectedDay) {
    (this.$dayInput as HTMLInputElement).value =
      day < 10 && day !== '' ? '0' + day : day.toString();
  }

  private setMainMonthInput(month: number | string = this._selectedMonth + 1) {
    (this.$monthInput as HTMLInputElement).value =
      month < 10 && month !== '' ? '0' + month : month.toString();
  }

  private setMainYearInput(year: number | string = this._selectedYear) {
    (this.$yearInput as HTMLInputElement).value = year.toString();
  }

  private getValidMonth(value: string) {
    let month = Number(value);
    if (month > 12) {
      month = 12;
      this.setMainMonthInput(month);
    }

    if (month < 0) {
      month = 1;
      this.setMainMonthInput(month);
    }
    return month;
  }

  private getValidDay(value: string) {
    let day = Number(value);
    const maxDays = getDaysInMonth(this._selectedMonth, this._selectedYear);
    if (day > maxDays) {
      day = maxDays;
      this.setMainDayInput(maxDays);
    }

    if (day < 0) {
      day = 1;
      this.setMainDayInput(day);
    }
    return day;
  }

  private getValidYear(value: string) {
    let year = Number(value);
    if (year > 9999) {
      year = 9999;
      this.setMainYearInput(year);
    }

    if (year < 1) {
      year = 1;
      this.setMainYearInput(year);
    }

    return year;
  }

  private validate() {
    this._isValid = true;

    if (
      !this.$dayInput?.checkValidity() ||
      !this.$monthInput?.checkValidity() ||
      !this.$yearInput?.checkValidity()
    ) {
      this.errorMessage = this.requiredErrorMessage;
      this._isValid = false;
    }

    if (
      isOutOfRange(this._selectedDate as Date, this._minDate, this._maxDate)
    ) {
      this.errorMessage = this.rangeErrorMessage;
      this._isValid = false;
    }
  }

  private setCalendarElementVariables() {
    this.$calendarFocusableElements = getFocusableElements(
      this.$calendar?.shadowRoot
    );
    this.$calendarFirstElement = this.$calendarFocusableElements[0];
    this.$calendarLastElement =
      this.$calendarFocusableElements[
        this.$calendarFocusableElements.length - 1
      ];
  }

  /**
   *
   * EVENT HANDLERS
   *
   */

  private inputControlClickHandler() {
    this.toggleCalendar();
  }

  private dropdownKeyDownHandler(e: KeyboardEvent): void {
    switch (e.key) {
      case 'Tab':
        this.dropdownTabHandler(e);
        break;
      case 'Escape':
        this.dropdownEscKeyHandler();
        break;
      default:
        break;
    }
  }

  private dropdownTabHandler(e: KeyboardEvent): void {
    const $focusedElement = (e.target as HTMLElement).shadowRoot
      ?.activeElement as HTMLElement;

    if (e.shiftKey) {
      this.dropdownBackwardTabHandler($focusedElement, e);
    } else {
      this.dropdownForwardTabHandler($focusedElement, e);
    }
  }

  private dropdownBackwardTabHandler(
    $focusedElement: Element,
    e: KeyboardEvent
  ): void {
    if ($focusedElement === this.$calendarFirstElement) {
      e.preventDefault();
      this.$calendarLastElement?.focus();
    }
  }

  private dropdownForwardTabHandler(
    $focusedElement: Element,
    e: KeyboardEvent
  ): void {
    if ($focusedElement === this.$calendarLastElement) {
      e.preventDefault();
      this.$calendarFirstElement?.focus();
    }
  }

  private dropdownEscKeyHandler(): void {
    this.hide();
  }

  private labelClickHandler() {
    this.$monthInput?.select();
  }

  private mainMonthKeyUpHandler(e: KeyboardEvent) {
    const month = (e.target as HTMLInputElement)?.value;

    switch (e.key) {
      case 'ArrowRight':
        this.$dayInput?.select();
        return;
      case ' ':
        e.preventDefault();
        this.show();
        return;
      case 'ArrowUp':
      case 'ArrowDown':
        if (month) {
          this._selectedMonth = Number(month) - 1;
          this.updateSelectedDate();
          this.emitInput();
        }
        return;
      default:
        if (!isNaN(e.key as any)) {
          this.mainMonthInputHandler();
        }
        return;
    }
  }

  private preventSpaceKeyDownHandler(e: KeyboardEvent) {
    if (e.key === ' ') {
      e.preventDefault();
      return false;
    }

    return true;
  }

  private mainMonthInputHandler() {
    const value = this.$monthInput?.value;

    if (!value) {
      return;
    }

    this._selectedMonth = this.getValidMonth(value);
    this.updateSelectedDate();

    if (value.length > 1 || this._selectedMonth > 1) {
      this.$dayInput?.select();
    }

    this.emitInput();
  }

  private mainDayKeyUpHandler(e: KeyboardEvent) {
    const day = (e.target as HTMLInputElement)?.value;

    switch (e.key) {
      case 'ArrowLeft':
        this.$monthInput?.select();
        return;
      case 'ArrowRight':
        this.$yearInput?.select();
        return;
      case 'ArrowUp':
      case 'ArrowDown':
        if (day) {
          this._selectedDay = Number(day);
          this.updateSelectedDate();
          this.emitInput();
        }
        return;
      case ' ':
        this.show();
        return;
      default:
        if (!isNaN(e.key as any)) {
          this.mainDayInputHandler();
        }
        break;
    }
  }

  private mainDayInputHandler() {
    const value = this.$dayInput?.value;

    if (!value) {
      return;
    }

    this._selectedDay = this.getValidDay(value);
    this.updateSelectedDate();

    if (value.length > 1 || this._selectedDay > 3) {
      this.$yearInput?.select();
    }

    this.emitInput();
  }

  private mainYearKeyUpHandler(e: KeyboardEvent) {
    const year = (e.target as HTMLInputElement)?.value;

    switch (e.key) {
      case 'ArrowLeft':
        this.$dayInput?.select();
        break;
      case 'ArrowUp':
      case 'ArrowDown':
        if (year) {
          this._selectedYear = Number(year);
          this.updateSelectedDate();
          this.emitInput();
        }
        return;
      case ' ':
        this.show();
        break;
      default:
        if (!isNaN(e.key as any)) {
          this.mainYearInputHandler();
        }
        return;
    }
  }

  private mainYearInputHandler() {
    const value = this.$yearInput?.value;

    if (!value) {
      return;
    }

    this._selectedYear = this.getValidYear(value);
    this.updateSelectedDate();
    this.emitInput();
  }

  private dateFocusedHandler(e: any) {
    if (!e.detail.value) {
      return;
    }

    const focusDate = new Date(e.detail.value);
    this.setSelectedValues(focusDate);
    this.setInputValues();
    setTimeout(() => this.validate());
  }

  private dateSelectedHandler(e: any) {
    if (!e.detail.value) {
      this.resetInputValues();
    } else {
      const focusDate = new Date(e.detail.value);
      this.setSelectedValues(focusDate);
      this.setInputValues();
    }

    setTimeout(() => {
      this.hide();
      this.validate();
    }, 100);
  }

  private beforeRender() {
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

  render() {
    this.beforeRender();

    return html`
      ${this.mainInputTemplate()}
      <div
        id="calendar-dropdown"
        class="${classMap({ 'calendar-dropdown': true, open: this._expanded })}"
        role="dialog"
        aria-label="${getMonthLabel(
          this._selectedMonth,
          this._selectedYear,
          this.getLocale()
        )}"
        @keydown="${this.dropdownKeyDownHandler}"
      >
        <ks-calendar
          .value=${getShortIsoDate(this._selectedDate as Date)}
          min-date="${this.minDate || ''}"
          max-date="${this.maxDate || ''}"
          day-label="${this.dayLabel}"
          month-label="${this.monthLabel}"
          year-label="${this.yearLabel}"
          clear-label="${this.clearLabel}"
          today-label="${this.todayLabel}"
          @date-focused="${this.dateFocusedHandler}"
          @date-selected="${this.dateSelectedHandler}"
        ></ks-calendar>
      </div>
    `;
  }

  private mainInputTemplate() {
    return html`
      <div class="controls">
        <fieldset class="main-input">
          <legend
            id="main_label"
            class="main-input-label"
            @click="${this.labelClickHandler}"
          >
            ${this.label}
          </legend>
          <div
            class="main-input-controls"
            role="textbox"
            aria-labelledby="main_label"
            aria-required="${this.required}"
            aria-invalid="${!this._isValid}"
            aria-errormessage="error_message"
          >
            <label for="month" class="sr-only">${this.monthLabel}</label>
            <input
              id="month"
              class="month"
              type="number"
              min="1"
              max="12"
              placeholder="mm"
              formnovalidate
              ?required=${this.required}
              @keyup="${this.mainMonthKeyUpHandler}"
              @keydown="${this.preventSpaceKeyDownHandler}"
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
              formnovalidate
              ?required=${this.required}
              @keyup="${this.mainDayKeyUpHandler}"
              @keydown="${this.preventSpaceKeyDownHandler}"
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
              formnovalidate
              ?required=${this.required}
              @keyup="${this.mainYearKeyUpHandler}"
              @keydown="${this.preventSpaceKeyDownHandler}"
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
          <div id="error_message" class="error-message">${this.errorMessage}</div>
        </fieldset>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ks-datepicker': KsDatepicker;
  }
}
