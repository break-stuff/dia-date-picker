/* eslint-disable class-methods-use-this */
/* eslint-disable no-console */
import { html, LitElement } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import '../calendar';

import { getFocusableElements } from '../utils/domUtils';
import {
  getShortIsoDate,
  getMonthLabel,
  formatDateString,
  getDaysInMonth,
  getDateFormat,
} from '../utils/dateUtils';

import { styles } from './datepicker.styles';
import icon from '../utils/icons';

export interface IFormFieldData {
  name?: string;
  value?: string;
  valueAsDate?: Date;
  isValid: boolean;
  validity: IDatePickerValidation;
}

export interface IDatePickerValidation {
  outOfRange?: boolean;
  valueMissing?: boolean;
  dateUnavailable?: boolean;
}

/**
 * @tag ks-datepicker
 *
 * @summary Custom date picker
 *
 * @attr {string} value - the date entered in the main input
 * @attr {string} label - label for main date input
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
 * @slot calendar-icon - icon in button toggle for date selector
 * @slot prev-month-icon - icon in previous month button
 * @slot next-month-icon - icon in next month button
 *
 * @cssprop [--primary-color=#293d4e] - Primary color used in the component
 * @cssprop [--error-color=#9a0000] - Color used to indicate input has an error
 * @cssprop [--outline=solid 2px var(--outline-color)] - Default outline style
 * @cssprop [--outline-color=#71a5d1] - Outline color
 * @cssprop [--outline-offset=0.125rem] - Outline offset
 * @cssprop [--border-color=#596d7f] - Default border color
 * @cssprop [--day-hover-background-color=#e0e7f3] - Background color of days in calendar when hovered
 * @cssprop [--day-disabled-color=#ccc] - Color of disabled days
 *
 * @event {CustomEvent} ks-input - emits the date as short ISO string when calendar date is manually entered or focused on in the calendar
 * @event {CustomEvent} ks-change - emits the date as short ISO string when calendar date is selected
 */
@customElement('ks-datepicker')
export class KsDatepicker extends LitElement {
  static styles = styles;

  /* the date entered in the main input */
  @property({ type: String, reflect: true })
  value?: string;

  @property({ type: String })
  label?: string;

  @property({ type: String })
  name?: string;

  @property({ type: Boolean })
  required = false;

  @property({ type: Boolean })
  disabled = false;

  @property({ type: Boolean })
  readonly = false;

  @property({ attribute: 'min-date', type: String })
  minDate?: string;

  @property({ attribute: 'max-date', type: String })
  maxDate?: string;

  @property({ attribute: 'start-date', type: String })
  startDate?: string;

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
  rangeErrorMessage = 'The date you have selected is not within the date range';

  @property({ attribute: 'unavailable-error-message', type: String })
  unavailableErrorMessage = 'The date you have selected is unavailable';

  @property({ attribute: 'disabled-dates', type: String })
  disabledDates?: string;

  @property({ attribute: 'show-week-numbers', type: Boolean })
  showWeekNumbers = false;

  @state()
  private _formFieldData: IFormFieldData = this.getInitialFormFieldData();

  @state()
  private _expanded = false;

  @state()
  private _isValid = true;

  @state()
  private _hadFocus = false;

  @state()
  private _errorMessage = this.requiredErrorMessage;

  @state()
  private _selectedDate?: Date;

  @state()
  private _curDate: Date = new Date(Date.now());

  @state()
  private _selectedDay: number = this._curDate.getDay();

  @state()
  private _selectedMonth: number = this._curDate.getMonth(); // Base 0

  @state()
  private _selectedYear: number = this._curDate.getFullYear();

  @state()
  private $calendarFocusableElements?: HTMLElement[];

  @state()
  private $calendarFirstElement?: HTMLElement;

  @state()
  private $calendarLastElement?: HTMLElement;

  @query('#input_0')
  private $firstInput?: HTMLInputElement;

  @query('#input_2')
  private $secondInput?: HTMLInputElement;

  @query('#input_4')
  private $thirdInput?: HTMLInputElement;

  @query('.day')
  private $dayInput?: HTMLInputElement;

  @query('.month')
  private $monthInput?: HTMLInputElement;

  @query('.year')
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
    setTimeout(() => this.$firstInput?.focus());
  }

  /**
   *
   * EVENT EMITTERS
   *
   */

  private emitInput() {
    if (
      !this.$firstInput?.value ||
      !this.$secondInput?.value ||
      !this.$thirdInput?.value
    ) {
      return;
    }

    this.updateSelectedDate();

    const options = {
      detail: { ...this._formFieldData },
      bubbles: true,
      composed: true,
    };

    this.dispatchEvent(new CustomEvent('ks-input', options));
  }

  private emitChange() {
    const options = {
      detail: { ...this._formFieldData },
      bubbles: true,
      composed: true,
    };

    this.dispatchEvent(new CustomEvent('ks-change', options));
  }

  /**
   *
   * COMPONENT LOGIC
   *
   */

  private getName(): string {
    return this.name ? this.name : this.toCamelCase(this.label || '');
  }

  private toCamelCase(value: string) {
    return value
      .toLowerCase()
      .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase());
  }

  private getInitialFormFieldData(): IFormFieldData {
    return {
      name: this.getName(),
      value: undefined,
      valueAsDate: undefined,
      isValid: true,
      validity: {
        dateUnavailable: false,
        outOfRange: false,
        valueMissing: false,
      },
    };
  }

  private setFormFieldData(data: IFormFieldData) {
    this._formFieldData = {
      name: this.getName(),
      value: data.value,
      valueAsDate: data.valueAsDate,
      isValid: data.isValid,
      validity: { ...data.validity },
    };
  }

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

      if (this._hadFocus) {
        this.validate();
      }
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
      ? new Date(formatDateString(this.value))
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
    if (!this.$firstInput) {
      return;
    }

    this.setMainDayInput();
    this.setMainMonthInput();
    this.setMainYearInput();
  }

  resetInputValues() {
    if (!this.$firstInput) {
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
    return month - 1;
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
    this._isValid = this._formFieldData.isValid;

    if (
      !this.$firstInput?.checkValidity() ||
      !this.$secondInput?.checkValidity() ||
      !this.$thirdInput?.checkValidity()
    ) {
      this._errorMessage = this.requiredErrorMessage;
      this._isValid = false;
      this._formFieldData.validity.valueMissing = true;
      return;
    }

    if (this._formFieldData.validity.outOfRange) {
      this._errorMessage = this.rangeErrorMessage;
      this._isValid = false;
      return;
    }

    if (this._formFieldData.validity.dateUnavailable) {
      this._errorMessage = this.unavailableErrorMessage;
      this._isValid = false;
      return;
    }

    this._isValid = true;
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
    this.$firstInput?.select();
  }

  private mainMonthKeyUpHandler(e: KeyboardEvent, index: number) {
    const month = (e.target as HTMLInputElement)?.value;

    switch (e.key) {
      case 'ArrowLeft':
        this.goToPrevInput(index);
        break;
      case 'ArrowRight':
        this.goToNextInput(index);
        break;
      case ' ':
        e.preventDefault();
        if (!this.disabled && !this.readonly) {
          this.show();
        }
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
          this.mainMonthInputHandler(e, index);
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

  private yearKeyDownHandler(e: KeyboardEvent) {
    const value = (e.target as HTMLInputElement).value;

    switch (e.key) {
      case 'ArrowUp':
        if (!value) {
          this._selectedYear = this._curDate.getFullYear() - 1;
          this.setMainYearInput(this._selectedYear);
        }
        return;
      case 'ArrowDown':
        if (!value) {
          this._selectedYear = this._curDate.getFullYear() + 1;
          this.setMainYearInput(this._selectedYear);
        }
        return;
      default:
        break;
    }

    this.preventSpaceKeyDownHandler(e);
  }

  private mainMonthInputHandler(e: KeyboardEvent, index: number) {
    const value = (e.target as HTMLInputElement).value;

    if (!value) {
      return;
    }

    this._selectedMonth = this.getValidMonth(value);
    this.updateSelectedDate();

    if (value.length > 1 || this._selectedMonth > 1) {
      this.goToNextInput(index);
    }

    this.emitInput();
  }

  private mainDayKeyUpHandler(e: KeyboardEvent, index: number) {
    const day = (e.target as HTMLInputElement).value;

    switch (e.key) {
      case 'ArrowLeft':
        this.goToPrevInput(index);
        break;
      case 'ArrowRight':
        this.goToNextInput(index);
        break;
      case 'ArrowUp':
      case 'ArrowDown':
        if (day) {
          this._selectedDay = Number(day);
          this.updateSelectedDate();
          this.emitInput();
        }
        return;
      case ' ':
        if (!this.disabled && !this.readonly) {
          this.show();
        }
        return;
      default:
        if (!isNaN(e.key as any)) {
          this.mainDayInputHandler(e, index);
        }
        break;
    }
  }

  private mainDayInputHandler(e: KeyboardEvent, index: number) {
    const value = (e.target as HTMLInputElement).value;

    if (!value) {
      return;
    }

    this._selectedDay = this.getValidDay(value);
    this.updateSelectedDate();

    if (value.length > 1 || this._selectedDay > 3) {
      this.goToNextInput(index);
    }

    this.emitInput();
  }

  private mainYearKeyUpHandler(e: KeyboardEvent, index: number) {
    const year = (e.target as HTMLInputElement).value;

    switch (e.key) {
      case 'ArrowLeft':
        this.goToPrevInput(index);
        break;
      case 'ArrowRight':
        this.goToNextInput(index);
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
        if (!this.disabled && !this.readonly) {
          this.show();
        }
        break;
      default:
        if (!isNaN(e.key as any)) {
          this.mainYearInputHandler(e);
        }
        return;
    }
  }

  private goToNextInput(index: number) {
    if (index === 0) {
      this.$secondInput?.select();
    }

    if (index === 2) {
      this.$thirdInput?.select();
    }
  }

  private goToPrevInput(index: number) {
    if (index === 4) {
      this.$secondInput?.select();
    }

    if (index === 2) {
      this.$firstInput?.select();
    }
  }

  private mainYearInputHandler(e: KeyboardEvent) {
    const value = (e.target as HTMLInputElement).value;

    if (!value) {
      return;
    }

    this._selectedYear = this.getValidYear(value);
    this.updateSelectedDate();
    this.emitInput();
  }

  private dateFocusedHandler(e: any) {
    this.setFormFieldData(e.detail);
    if (!this._formFieldData.value) {
      return;
    }

    this.setSelectedValues(this._formFieldData.valueAsDate as Date);
    this.setInputValues();
    setTimeout(() => {
      this.validate();
      this.emitInput();
    });
  }

  private dateSelectedHandler(e: any) {
    this.setFormFieldData(e.detail);
    if (!this._formFieldData.value) {
      this.resetInputValues();
    } else {
      this.setSelectedValues(this._formFieldData.valueAsDate as Date);
      this.setInputValues();
    }

    setTimeout(() => {
      this.hide();
      this.validate();
      this.emitInput();
      this.emitChange();
    }, 100);
  }

  private dateInputFocusHandler() {
    this._hadFocus = true;
  }

  private beforeRender() {
    this._selectedDate = this.getSelectedDate();
  }

  /**
   *
   * TEMPLATES AND RENDERING
   *
   */

  render() {
    this.beforeRender();

    return html` ${this.mainInputTemplate()} ${this.dropdownTemplate()} `;
  }

  private mainInputTemplate() {
    const dateFormat = getDateFormat(this.getLocale());
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
            ${this.inputTemplates(dateFormat[0], 0)}
            <span aria-hidden="true">${dateFormat[1]}</span>
            ${this.inputTemplates(dateFormat[2], 2)}
            <span aria-hidden="true">${dateFormat[3]}</span>
            ${this.inputTemplates(dateFormat[4], 4)}
            <button
              class="calendar-toggle"
              aria-haspopup="true"
              aria-expanded=${this._expanded}
              aria-controls="calendar-dropdown"
              ?disabled="${this.disabled || this.readonly}"
              @click="${this.inputControlClickHandler}"
            >
              ${icon('calendar')}
            </button>
          </div>
          <div id="error_message" class="error-message" aria-live="assertive">
            ${this._errorMessage}
          </div>
        </fieldset>
      </div>
    `;
  }

  inputTemplates(input: string, index: number) {
    if (input === 'dd') {
      const placeholder = this.dayLabel.charAt(0).toLocaleLowerCase().repeat(2);
      return html`
        <label for="day" class="sr-only">${this.dayLabel}</label>
        <input
          id="input_${index}"
          class="day"
          type="number"
          min="1"
          max="${getDaysInMonth(this._selectedMonth, this._selectedYear)}"
          placeholder="${placeholder}"
          formnovalidate
          ?required=${this.required}
          ?disabled=${this.disabled}
          ?readonly=${this.readonly}
          @focus="${this.dateInputFocusHandler}"
          @keyup="${(e: KeyboardEvent) => this.mainDayKeyUpHandler(e, index)}"
          @keydown="${this.preventSpaceKeyDownHandler}"
        />
      `;
    }

    if (input === 'mm') {
      const placeholder = this.monthLabel
        .charAt(0)
        .toLocaleLowerCase()
        .repeat(2);
      return html`
        <label for="month" class="sr-only">${this.monthLabel}</label>
        <input
          id="input_${index}"
          class="month"
          type="number"
          min="1"
          max="12"
          placeholder="${placeholder}"
          formnovalidate
          ?required=${this.required}
          ?disabled=${this.disabled}
          ?readonly=${this.readonly}
          @focus="${this.dateInputFocusHandler}"
          @keyup="${(e: KeyboardEvent) => this.mainMonthKeyUpHandler(e, index)}"
          @keydown="${this.preventSpaceKeyDownHandler}"
        />
      `;
    }

    if (input === 'yyyy') {
      const placeholder = this.yearLabel
        .charAt(0)
        .toLocaleLowerCase()
        .repeat(4);
      return html`
        <label for="year" class="sr-only">${this.yearLabel}</label>
        <input
          id="input_${index}"
          class="year"
          type="number"
          min="1"
          max="9999"
          placeholder="${placeholder}"
          formnovalidate
          ?required=${this.required}
          ?disabled=${this.disabled}
          ?readonly=${this.readonly}
          @focus="${this.dateInputFocusHandler}"
          @keyup="${(e: KeyboardEvent) => this.mainYearKeyUpHandler(e, index)}"
          @keydown="${this.yearKeyDownHandler}"
        />
      `;
    }

    return '';
  }

  dropdownTemplate() {
    return html`
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
          disabled-dates="${this.disabledDates || ''}"
          ?show-week-numbers=${this.showWeekNumbers}
          lang="${this.getLocale()}"
          start-date="${this.startDate || ''}"
          @date-focused="${this.dateFocusedHandler}"
          @date-selected="${this.dateSelectedHandler}"
        ></ks-calendar>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ks-datepicker': KsDatepicker;
  }
}
