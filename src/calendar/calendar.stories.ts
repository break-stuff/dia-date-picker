import { html } from 'lit';
import './index';

export default {
  title: 'Components/Calendar',
  component: 'dia-calendar',
  args: {
    value: '',
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
      handles: ['ks-focus', 'ks-select'],
    },
  },
};

const DefaultTemplate = (args: any) => {
  return html`
    <style>
      dia-calendar {
        --dia-border-color: ${args['--dia-border-color']};
        --dia-border-radius: ${args['--dia-border-radius']};
        --dia-disabled-color: ${args['--dia-disabled-color']};
        --dia-error-color: ${args['--dia-error-color']};
        --dia-outline: ${args['--dia-outline']};
        --dia-outline-offset: ${args['--dia-outline-offset']};
        --dia-primary-color: ${args['--dia-primary-color']};
      }
    </style>

    <dia-calendar
      id="example"
      value="${args.value}"
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
    ></dia-calendar>
    <!--<span>some random inline content</span>
        <div>some random block content</div>-->
  `;
};

const DaySlotTemplate = (args: any) => {
  return html`
    <dia-calendar
      label="Day Slot Example"
      focus-date="2-22-2022"
    >
    <span slot="2022-02-02">$300</span>
    <span slot="2022-02-05">$100</span>
    <span slot="2022-02-15">$500 <br> <em>free</em></span>
  </dia-calendar>
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

export const DisabledDates: any = DefaultTemplate.bind({});
DisabledDates.args = {
  ['disabled-dates']: '2/2/2022, 2/4/2022, 2/6/2022',
  ['focus-date']: '2/1/2022',
};

export const FocusDate: any = DefaultTemplate.bind({});
FocusDate.args = {
  ['focus-date']: '5/25/2025',
};

export const DisabledWeekDays: any = DefaultTemplate.bind({});
DisabledWeekDays.args = {
  ['disabled-week-days']: '3, 5',
};

export const WeekNumbers: any = DefaultTemplate.bind({});
WeekNumbers.args = {
  ['show-week-numbers']: true,
};

export const DaySlots: any = DaySlotTemplate.bind({});
DaySlots.args = {};
