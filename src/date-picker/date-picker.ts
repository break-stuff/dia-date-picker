/* eslint-disable class-methods-use-this */
/* eslint-disable no-console */
import { html, LitElement } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import '../calendar';

import { getFocusableElements, keys } from '../utils/domUtils';
import {
  getShortIsoDate,
  getMonthLabel,
  formatDateString,
  getDaysInMonth,
  getDateFormat,
} from '../utils/dateUtils';

import { styles } from './date-picker.styles';
import icon from '../utils/icons';
import { watch } from '../utils/watchDecorator';
import { DiaCalendar } from '../calendar';

export interface FormFieldData {
  name?: string;
  value?: string;
  valueAsDate?: Date;
  isValid: boolean;
  validity: DatePickerValidation;
}

export interface DatePickerValidation {
  outOfRange?: boolean;
  valueMissing?: boolean;
  dateUnavailable?: boolean;
}

/**
 * @tag dia-date-picker
 *
 * @summary Custom date picker
 *
 * @slot calendar-icon - icon in button toggle for date selector
 * @slot prev-month-icon - icon in previous month button
 * @slot next-month-icon - icon in next month button
 *
 * @cssprop [--border-color=#c5d1da] - Default border color
 * @cssprop [--border-radius=0.25rem] - Default border radius
 * @cssprop [--disabled-color=#acbdca] - Color of disabled days
 * @cssprop [--error-color=#b32e2e] - Color used to communicate error in the component
 * @cssprop [--outline=solid 0.0625rem #37444F] - Default focus outline style
 * @cssprop [--outline-offset=0.125rem] - Outline offset
 * @cssprop [--primary-color=#004884] - Primary color used in the component
 *
 * @csspart dropdown - controls styles for the dropdown panel that contains the calendar
 * @csspart main-input - controls styles for the main input for day, month, and year
 * @csspart calendar-toggle - controls styles for the toggle button to show and hide the calendar
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
 * @csspart clear - Controls style of "Clear" button
 * @csspart today - Controls style of "Today" button
 *
 * @event {CustomEvent} dia-input - emits the date as short ISO string when calendar date is manually entered or focused on in the calendar
 * @event {CustomEvent} dia-change - emits the date as short ISO string when calendar date is selected
 */
@customElement('dia-date-picker')
export class DiaDatePicker extends LitElement {
  static styles = styles;

  /** selected value in input */
  @property({ type: String, reflect: true })
  value?: string;

  /** label for main date input */
  @property({ type: String })
  label?: string;

  /** name used to identify the input */
  @property({ type: String })
  name?: string;

  /** adds required validation to the input */
  @property({ type: Boolean })
  required = false;

  /** disables input and calendar drop-down */
  @property({ type: Boolean })
  disabled = false;

  /** makes input readonly and disables drop-down */
  @property({ type: Boolean })
  readonly = false;

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

  /** message displayed when required validation fails */
  @property({ attribute: 'required-error-message', type: String })
  requiredErrorMessage = 'This field is required';

  /** message displayed when selected date is out of range */
  @property({ attribute: 'range-error-message', type: String })
  rangeErrorMessage = 'The date you have selected is not within the date range';

  /** message displayed when disabled date is selected */
  @property({ attribute: 'unavailable-error-message', type: String })
  unavailableErrorMessage = 'The date you have selected is unavailable';

  @state()
  private _formFieldData: FormFieldData = this.getInitialFormFieldData();

  @state()
  private _expanded = false;

  @state()
  private _isValid = true;

  @state()
  private _isFocused = false;

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
  private $dropDownFocusableElements?: HTMLElement[];

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

  @query('dia-calendar')
  private $calendar?: DiaCalendar;

  @query('.today')
  private $todayButton?: HTMLButtonElement;

  @watch('value', { waitUntilFirstUpdate: true })
  handleValueChange() {
    const focusDate = this.getDefaultDate();

    if (!this._isFocused) {
      this.setSelectedValues(focusDate);
      this.setInputValues();
    }
  }

  get valueAsDate() {
    return this.value ? new Date(formatDateString(this.value)) : undefined;
  }

  /**
   *
   * LIFECYCLE HOOKS
   *
   */

  protected firstUpdated(): void {
    this.handleComponentBlur();
    this.initInputValues();
    setTimeout(() => this.setCalendarElementVariables());
  }

  protected async performUpdate() {
    // update selected values when value changes
    this._selectedDate = this.getSelectedDate();
    setTimeout(() => this.updateInputValues());
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
    this.value = getShortIsoDate(this._selectedDate as Date);
  }

  public validate() {
    this.validateInput();
    return this._formFieldData;
  }

  /**
   *
   * EVENT EMITTERS
   *
   */

  private emitInput() {
    if (!this.hasCompletedAllFields()) {
      return;
    }

    this.updateSelectedDate();

    const options = {
      detail: { ...this._formFieldData },
      bubbles: true,
      composed: true,
    };

    this.dispatchEvent(new CustomEvent('dia-input', options));
    (this.$calendar as DiaCalendar).value = getShortIsoDate(
      this._selectedDate as Date
    );
  }

  private emitChange() {
    this.value = getShortIsoDate(this._selectedDate as Date);
    const options = {
      detail: { ...this._formFieldData },
      bubbles: true,
      composed: true,
    };

    this.dispatchEvent(new CustomEvent('dia-change', options));
  }

  /**
   *
   * COMPONENT LOGIC
   *
   */

  private getDefaultDate() {
    return this.value
      ? new Date(formatDateString(this.value as string))
      : this.focusDate
      ? new Date(formatDateString(this.focusDate as string))
      : this._curDate;
  }

  private getName(): string {
    return this.name ? this.name : this.toCamelCase(this.label || '');
  }

  private toCamelCase(value: string) {
    return value
      .toLowerCase()
      .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase());
  }

  private getInitialFormFieldData(): FormFieldData {
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

  private setFormFieldData(data: FormFieldData) {
    this._formFieldData = {
      name: this.getName(),
      value: data.value,
      valueAsDate: data.valueAsDate,
      isValid: data.isValid,
      validity: { ...data.validity },
    };
  }

  private initInputValues() {
    const selectedDate = this.value
      ? new Date(formatDateString(this.value))
      : this._curDate;
    this.setSelectedValues(selectedDate);

    if (this.value) {
      this.setInputValues();
    }
  }

  private updateInputValues() {
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

  private setInputValues() {
    if (!this.$firstInput) {
      return;
    }

    this.setDayInput();
    this.setMonthInput();
    this.setYearInput();
  }

  private resetInputValues() {
    this.value = undefined;
    this.setSelectedValues(this.getDefaultDate());
    this.setDayInput('');
    this.setMonthInput('');
    this.setYearInput('');
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

  private setDayInput(day: number | string = this._selectedDay) {
    (this.$dayInput as HTMLInputElement).value =
      day < 10 && day !== '' ? '0' + day : day.toString();
  }

  private setMonthInput(month: number | string = this._selectedMonth + 1) {
    (this.$monthInput as HTMLInputElement).value =
      month < 10 && month !== '' ? '0' + month : month.toString();
  }

  private setYearInput(year: number | string = this._selectedYear) {
    (this.$yearInput as HTMLInputElement).value = year.toString();
  }

  private getValidMonth(value: string) {
    let month = Number(value);
    if (month > 12) {
      month = 12;
    }

    if (month < 0) {
      month = 1;
    }
    return month - 1;
  }

  private getValidDay(value: string) {
    let day = Number(value);
    const maxDays = getDaysInMonth(this._selectedMonth, this._selectedYear);
    if (day > maxDays) {
      day = maxDays;
    }

    if (day < 0) {
      day = 1;
    }
    return day;
  }

  private validateInput() {
    this._isValid = true;

    if (this.required && !this.hasCompletedAllFields()) {
      this._errorMessage = this.requiredErrorMessage;
      this._isValid = false;
      this._formFieldData.isValid = false;
      return;
    }

    if (this._formFieldData.validity.outOfRange) {
      this._errorMessage = this.rangeErrorMessage;
      this._isValid = false;
      this._formFieldData.isValid = false;
      return;
    }

    if (this._formFieldData.validity.dateUnavailable) {
      this._errorMessage = this.unavailableErrorMessage;
      this._isValid = false;
      this._formFieldData.isValid = false;
      return;
    }

    this._isValid = true;
    this._formFieldData.isValid = true;
    this._formFieldData.validity.valueMissing = false;
    this._formFieldData.validity.outOfRange = false;
    this._formFieldData.validity.dateUnavailable = false;
  }

  private setCalendarElementVariables() {
    this.$dropDownFocusableElements = getFocusableElements(
      this.$calendar?.shadowRoot
    );
    this.$calendarFirstElement = this.$dropDownFocusableElements[0];
    this.$calendarLastElement = this.$todayButton;
  }

  private hasCompletedAllFields() {
    return (
      this.$firstInput?.value &&
      this.$secondInput?.value &&
      this.$thirdInput?.value
    );
  }

  private selectDate(date: Date) {
    this.setSelectedValues(date);
    this.setInputValues();

    setTimeout(() => {
      this.hide();
      this.validateInput();
      this.emitInput();
      this.emitChange();
    }, 100);
  }

  /**
   *
   * EVENT HANDLERS
   *
   */

  private handleComponentBlur() {
    window.addEventListener('click', (e: MouseEvent) => {
      if (this.contains(e.target as HTMLElement)) {
        return;
      }

      this._expanded = false;

      if (this._isFocused) {
        this.validateInput();
        this._isFocused = false;
      }
    });
  }

  private handleInputControlClick() {
    this.toggleCalendar();
  }

  private handleDropdownKeyDown(e: KeyboardEvent): void {
    switch (e.key) {
      case keys.Tab:
        this.handleDropdownTab(e);
        break;
      case keys.Escape:
        this.handleDropdownEscKey();
        break;
      default:
        break;
    }
  }

  private handleDropdownTab(e: KeyboardEvent): void {
    const $focusedElement = (e.target as HTMLElement).shadowRoot
      ?.activeElement as HTMLElement || e.target;

    if (e.shiftKey) {
      this.handleDropdownBackwardTab($focusedElement, e);
    } else {
      this.handleDropdownForwardTab($focusedElement, e);
    }
  }

  private handleDropdownBackwardTab(
    $focusedElement: Element,
    e: KeyboardEvent
  ): void {
    if ($focusedElement === this.$calendarFirstElement) {
      e.preventDefault();
      this.$calendarLastElement?.focus();
    }
  }

  private handleDropdownForwardTab(
    $focusedElement: Element,
    e: KeyboardEvent
  ): void {
    if ($focusedElement === this.$calendarLastElement) {
      e.preventDefault();
      
      this.$calendarFirstElement?.focus();
    }
  }

  private handleDropdownEscKey(): void {
    this.hide();
  }

  private handleLabelClick() {
    this.$firstInput?.select();
  }

  private handleInputKeyDown(e: KeyboardEvent) {
    if (e.key === keys.Space) {
      e.preventDefault();
      return false;
    }

    return true;
  }

  private handleYearInput(e: KeyboardEvent, index: number) {
    const value = (e.target as HTMLInputElement).value;
    const formattedValue = Number(value);
    this._selectedYear =
      formattedValue > 9999 ? 9999 : formattedValue < 1 ? 1 : formattedValue;

    if (e.key !== keys.ArrowUp && e.key !== keys.ArrowDown && value.length === 4) {
      this.setYearInput();
      this.goToNextInput(index);
      this.emitInput();
    }
  }

  private handleYearKeyUp(e: KeyboardEvent, index: number) {
    switch (e.key) {
      case keys.ArrowLeft:
        this.goToPrevInput(index);
        break;
      case keys.ArrowRight:
        this.goToNextInput(index);
        break;
      default:
        break;
    }
  }

  private handleYearKeyDown(e: KeyboardEvent, index: number) {
    switch (e.key) {
      case keys.Shift:
      case keys.Tab:
        break;
      case keys.Space:
        if (!this.disabled && !this.readonly) {
          this.show();
        }
        break;
      default:
        this.handleYearInput(e, index);
        break;
    }

    this.handleInputKeyDown(e);
  }

  private handleMonthInput(e: KeyboardEvent, index: number) {
    const value = (e.target as HTMLInputElement).value;

    if (!value) {
      return;
    }

    this._selectedMonth = this.getValidMonth(value);

    if (
      e.key !== keys.ArrowUp &&
      e.key !== keys.ArrowDown &&
      (value.length > 1 || this._selectedMonth > 0)
    ) {
      this.setMonthInput();
      this.goToNextInput(index);
    }

    this.emitInput();
  }

  private handleMonthKeyUp(e: KeyboardEvent, index: number) {
    switch (e.key) {
      case keys.Shift:
      case keys.Tab:
        break;
      case keys.ArrowLeft:
        this.goToPrevInput(index);
        break;
      case keys.ArrowRight:
        this.goToNextInput(index);
        break;
      case keys.Space:
        e.preventDefault();
        if (!this.disabled && !this.readonly) {
          this.show();
        }
        break;
      default:
        this.handleMonthInput(e, index);
        break;
    }
  }

  private handleDayKeyUp(e: KeyboardEvent, index: number) {
    switch (e.key) {
      case keys.Shift:
      case keys.Tab:
        break;
      case keys.ArrowLeft:
        this.goToPrevInput(index);
        break;
      case keys.ArrowRight:
        this.goToNextInput(index);
        break;
      case keys.Space:
        if (!this.disabled && !this.readonly) {
          this.show();
        }
        return;
      default:
        this.handleDayInput(e, index);
        break;
    }
  }

  private handleDayInput(e: KeyboardEvent, index: number) {
    const value = (e.target as HTMLInputElement).value;

    if (!value) {
      return;
    }

    this._selectedDay = this.getValidDay(value);

    if (
      e.key !== keys.ArrowUp &&
      e.key !== keys.ArrowDown &&
      (value.length > 1 || this._selectedDay > 3)
    ) {
      this.setDayInput();
      this.goToNextInput(index);
    }

    this.emitInput();
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

  private handleDateFocused(e: any) {
    this.setFormFieldData(e.detail);
    if (!this._formFieldData.value) {
      return;
    }

    this.setSelectedValues(this._formFieldData.valueAsDate as Date);
    this.setInputValues();
    setTimeout(() => {
      this.validateInput();
      this.emitInput();
    });
  }

  private handleDateSelected(e: any) {
    this.setFormFieldData(e.detail);
    this.selectDate(this._formFieldData.valueAsDate as Date);
  }

  private handleDateInputFocus() {
    this._isFocused = true;
  }

  private handleDateInputBlur() {
    setTimeout(() => {
      this._isFocused = this === document.activeElement;
      if(!this._isFocused) {
        this.validate();
      }
    });
  }

  private handleTodayClick(): void {
    this.selectDate(new Date());
  }

  private handleClearClick(): void {
    this.resetInputValues();
    this.hide();
  }

  /**
   *
   * TEMPLATES AND RENDERING
   *
   */

  render() {
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
            @click="${this.handleLabelClick}"
          >
            ${this.label}
          </legend>
          <div
            class="main-input-controls"
            role="textbox"
            part="main-input"
            aria-labelledby="main_label"
            aria-required="${this.required}"
            aria-invalid="${!this._isValid}"
            aria-errormessage="error_message"
            aria-disabled="${this.disabled}"
          >
            ${this.inputTemplates(dateFormat[0], 0)}
            <span aria-hidden="true">${dateFormat[1]}</span>
            ${this.inputTemplates(dateFormat[2], 2)}
            <span aria-hidden="true">${dateFormat[3]}</span>
            ${this.inputTemplates(dateFormat[4], 4)}
            <button
              class="calendar-toggle"
              part="calendar-toggle"
              aria-haspopup="true"
              aria-expanded=${this._expanded}
              aria-controls="calendar-dropdown"
              ?disabled="${this.disabled || this.readonly}"
              @focus="${this.handleDateInputFocus}"
              @blur="${this.handleDateInputBlur}"
              @click="${this.handleInputControlClick}"
            >
              <slot name="calendar-icon"> ${icon('calendar')} </slot>
            </button>
          </div>
          <div id="error_message" class="error-message" aria-live="assertive">
            ${this._errorMessage}
          </div>
        </fieldset>
      </div>
    `;
  }

  private inputTemplates(input: string, index: number) {
    if (input === 'dd') {
      const placeholder = this.dayLabel.charAt(0).toLocaleLowerCase().repeat(2);
      return html`
        <label for="input_${index}" class="sr-only">${this.dayLabel}</label>
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
          @focus="${this.handleDateInputFocus}"
          @keyup="${(e: KeyboardEvent) => this.handleDayKeyUp(e, index)}"
          @keydown="${this.handleInputKeyDown}"
        />
      `;
    }

    if (input === 'mm') {
      const placeholder = this.monthLabel
        .charAt(0)
        .toLocaleLowerCase()
        .repeat(2);
      return html`
        <label for="input_${index}" class="sr-only">${this.monthLabel}</label>
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
          @focus="${this.handleDateInputFocus}"
          @keyup="${(e: KeyboardEvent) => this.handleMonthKeyUp(e, index)}"
          @keydown="${this.handleInputKeyDown}"
        />
      `;
    }

    if (input === 'yyyy') {
      const placeholder = this.yearLabel
        .charAt(0)
        .toLocaleLowerCase()
        .repeat(4);
      return html`
        <label for="input_${index}" class="sr-only">${this.yearLabel}</label>
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
          @focus="${this.handleDateInputFocus}"
          @keyup="${(e: KeyboardEvent) => this.handleYearKeyUp(e, index)}"
          @keydown="${this.handleYearKeyDown}"
        />
      `;
    }

    return '';
  }

  private dropdownTemplate() {
    return html`
      <div
        id="calendar-dropdown"
        class="${classMap({ 'calendar-dropdown': true, open: this._expanded })}"
        role="dialog"
        part="dropdown"
        aria-label="${getMonthLabel(
          this._selectedMonth,
          this._selectedYear,
          this.getLocale()
        )}"
        @keydown="${this.handleDropdownKeyDown}"
      >
        <dia-calendar
          class="calendar-control"
          value=${this.value || ''}
          min-date="${this.minDate || ''}"
          max-date="${this.maxDate || ''}"
          day-label="${this.dayLabel}"
          month-label="${this.monthLabel}"
          year-label="${this.yearLabel}"
          clear-label="${this.clearLabel}"
          today-label="${this.todayLabel}"
          disabled-dates="${this.disabledDates || ''}"
          disabled-week-days="${this.disabledWeekDays || ''}"
          ?show-week-numbers=${this.showWeekNumbers}
          first-day-of-week="${this.firstDayOfWeek || ''}"
          lang="${this.getLocale()}"
          focus-date="${this.focusDate || ''}"
          @dia-focus="${this.handleDateFocused}"
          @dia-select="${this.handleDateSelected}"
        >
          <slot></slot>
        </dia-calendar>

        ${this.bottomControlsTemplate()}
      </div>
    `;
  }

  private bottomControlsTemplate() {
    return html`
      <div class="bottom-controls">
        <button
          class="clear"
          part="button clear"
          @click="${this.handleClearClick}"
        >
          ${this.clearLabel}
        </button>
        <button
          class="today"
          part="button today"
          @click="${this.handleTodayClick}"
        >
          ${this.todayLabel}
        </button>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'dia-date-picker': DiaDatePicker;
  }
}
