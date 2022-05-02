import { html } from 'lit';
import './index';

export default {
  title: 'Components/Calendar',
  component: 'ks-calendar',
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
    ['--ks-border-color']: 'rgb(var(--ks-color-light-base))',
    ['--ks-border-radius']: '0.25rem',
    ['--ks-disabled-color']: 'rgb(var(--ks-color-light-dark))',
    ['--ks-error-color']: 'rgb(var(--ks-color-danger-base))',
    ['--ks-outline']: 'var(--ks-default-outline)',
    ['--ks-outline-offset']: '0.125rem',
    ['--ks-primary-color']: 'rgb(var(--ks-color-primary-base))',
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
      ks-calendar {
        --ks-border-color: ${args['--ks-border-color']};
        --ks-border-radius: ${args['--ks-border-radius']};
        --ks-disabled-color: ${args['--ks-disabled-color']};
        --ks-error-color: ${args['--ks-error-color']};
        --ks-outline: ${args['--ks-outline']};
        --ks-outline-offset: ${args['--ks-outline-offset']};
        --ks-primary-color: ${args['--ks-primary-color']};
      }
    </style>

    <ks-calendar
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
    ></ks-calendar>
    <!--<span>some random inline content</span>
        <div>some random block content</div>-->
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
