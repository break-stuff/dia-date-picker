import { html } from 'lit';
import './index';

export default {
  title: 'Components/Date Picker',
  component: 'ks-datepicker',
  args: {
    value: '',
    label: 'Select Date',
    required: 'false',
    lang: 'en-US',
    ['min-date']: '',
    ['max-date']: '',
    ['day-label']: 'Day',
    ['month-label']: 'Month',
    ['year-label']: 'Year',
    ['clear-label']: 'Clear',
    ['today-label']: 'Today',
    ['disabled-dates']: '',
    ['show-week-numbers']: false,
    ['--primary-color']: '#2c5374',
    ['--error-color']: '#9a0000',
    ['--outline']: 'solid 2px #71a5d1',
    ['--outline-color']: '#71a5d1',
    ['--outline-offset']: '0.125rem',
    ['--border-color']: 'rgb(197, 209, 218)',
    ['--day-hover-background-color']: '#e0e7f3',
    ['--day-disabled-color']: '#ccc',
  },
  parameters: {
    actions: {
      handles: ['ks-input'],
    },
  },
};

const Template = (args: any) => {
  return html`
    <ks-datepicker
      value="${args.value}"
      label="${args.label}"
      ?required="${args.required}"
      lang="${args.lang}"
      min-date="${args['min-date']}"
      max-date="${args['max-date']}"
      day-label="${args['day-label']}"
      month-label="${args['month-label']}"
      year-label="${args['year-label']}"
      clear-label="${args['clear-label']}"
      today-label="${args['today-label']}"
      disabled-dates="${args['disabled-dates']}"
      ?show-week-numbers="${args['show-week-numbers']}"
    ></ks-datepicker>
    <!-- <span>some random inline content</span>
        <div>some random block content</div> -->
  `;
};

export const Default: any = Template.bind({});
Default.args = {};

export const PresetValue: any = Template.bind({});
PresetValue.args = {
  value: '12/2/2020',
};

export const MinMaxDates: any = Template.bind({});
MinMaxDates.args = {
  ['min-date']: '2/2/2022',
  ['max-date']: '2-22-22',
};

export const Validation: any = Template.bind({});
Validation.args = {
  required: 'true',
};

export const DisabledDates: any = Template.bind({});
DisabledDates.args = {
  ['disabled-dates']: '2/2/2022, 2/4/2022, 2/6/2022',
};
