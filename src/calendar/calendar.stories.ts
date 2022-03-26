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
  },
  parameters: {
    actions: {
      handles: ['date-focused', 'date-selected'],
    },
  },
};

const Template = (args: any) => {
  return html`
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
        ></ks-calendar>
        <!--<span>some random inline content</span>
        <div>some random block content</div>-->
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

export const DisabledDates: any = Template.bind({});
DisabledDates.args = {
  ['disabled-dates']: '2/2/2022, 2/4/2022, 2/6/2022'
};
