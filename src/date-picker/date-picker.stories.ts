import { html } from 'lit';
import './index';

export default {
  title: 'Components/Date Picker',
  component: 'dia-date-picker',
  args: {
    value: '',
    label: 'Select Date',
    required: false,
    disabled: false,
    readonly: false,
    lang: 'en-US',
    ['min-date']: '',
    ['max-date']: '',
    ['day-label']: 'Day',
    ['month-label']: 'Month',
    ['year-label']: 'Year',
    ['clear-label']: 'Clear',
    ['today-label']: 'Today',
    ['disabled-dates']: '',
    ['disabled-week-days']: '',
    ['focus-date']: '',
    ['show-week-numbers']: false,
    ['first-day-of-week']: 0,
    ['--dia-border-color']: 'rgb(var(--dia-color-light-base))',
    ['--dia-border-radius']: '0.25rem',
    ['--dia-disabled-color']: 'rgb(var(--dia-color-light-dark))',
    ['--dia-error-color']: 'rgb(var(--dia-color-danger-base))',
    ['--dia-outline']: 'var(--dia-default-outline)',
    ['--dia-outline-offset']: '0.125rem',
    ['--dia-primary-color']: 'rgb(var(--dia-color-primary-base))',
  },
  parameters: {
    actions: {
      handles: ['ks-input', 'ks-change'],
    },
  },
};

const DefaultTemplate = (args: any) => {
  return html`
    <style>
      dia-date-picker {
        --dia-border-color: ${args['--dia-border-color']};
        --dia-border-radius: ${args['--dia-border-radius']};
        --dia-disabled-color: ${args['--dia-disabled-color']};
        --dia-error-color: ${args['--dia-error-color']};
        --dia-outline: ${args['--dia-outline']};
        --dia-outline-offset: ${args['--dia-outline-offset']};
        --dia-primary-color: ${args['--dia-primary-color']};
      }
    </style>
    <dia-date-picker
      value="${args.value}"
      label="${args.label}"
      ?required="${args.required}"
      ?readonly="${args.readonly}"
      ?disabled="${args.disabled}"
      lang="${args.lang}"
      min-date="${args['min-date']}"
      max-date="${args['max-date']}"
      day-label="${args['day-label']}"
      month-label="${args['month-label']}"
      year-label="${args['year-label']}"
      clear-label="${args['clear-label']}"
      today-label="${args['today-label']}"
      disabled-dates="${args['disabled-dates']}"
      disabled-week-days="${args['disabled-week-days']}"
      focus-date="${args['focus-date']}"
      ?show-week-numbers="${args['show-week-numbers']}"
      first-day-of-week="${args['first-day-of-week']}"
    ></dia-date-picker>
    <!-- <span>some random inline content</span>
        <div>some random block content</div> -->
  `;
};

export const Default: any = DefaultTemplate.bind({});
Default.args = {};

export const PresetValue: any = DefaultTemplate.bind({});
PresetValue.args = {
  value: '12/2/2020',
};

export const MinMaxDates: any = DefaultTemplate.bind({});
MinMaxDates.args = {
  ['focus-date']: '2/10/2022',
  ['min-date']: '2/2/2022',
  ['max-date']: '2-22-22',
};

export const Validation: any = DefaultTemplate.bind({});
Validation.args = {
  required: 'true',
};

export const DisabledDates: any = DefaultTemplate.bind({});
DisabledDates.args = {
  ['focus-date']: '2/10/2022',
  ['disabled-dates']: '2/2/2022, 2/4/2022, 2/6/2022',
};

export const DisabledInput: any = DefaultTemplate.bind({});
DisabledInput.args = {
  value: '12/22/2025',
  disabled: true,
};

export const ReadonlyInput: any = DefaultTemplate.bind({});
ReadonlyInput.args = {
  value: '12/22/2025',
  readonly: true,
};

export const DisabledWeekDays: any = DefaultTemplate.bind({});
DisabledWeekDays.args = {
  ['disabled-week-days']: '1, 6',
};
