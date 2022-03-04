import "./index";

export default {
    title: 'Components/Date Picker',
    component: 'ks-datepicker',
    args: {
       value: '',
       label: 'Select Date',
       locale: 'en-US',
       ['min-date']: '',
       ['max-date']: '',
       ['day-label']: 'Day',
       ['month-label']: 'Month',
       ['year-label']: 'Year',
       ['clear-label']: 'Clear',
       ['today-label']: 'Today',
       
    },
    parameters: {
        actions: {
            handles: ['ks-change', 'ks-input'],
        },
    },
};

const Template = (args: any) => {
    return `
        <ks-datepicker
            value="${args.value}"
            label="${args.label}"
            locale="${args.locale}"
            min-date="${args['min-date']}"
            max-date="${args['max-date']}"
            day-label="${args['day-label']}"
            month-label="${args['month-label']}"
            year-label="${args['year-label']}"
            clear-label="${args['clear-label']}"
            today-label="${args['today-label']}"
        ></ks-datepicker>
        <!--<span>some random inline content</span>
        <div>some random block content</div>-->
    `
};

export const Default: any = Template.bind({});
Default.args = {};

export const MinMaxDates: any = Template.bind({});
MinMaxDates.args = {
    ['min-date']: '2/2/2022',
    ['max-date']: '2-22-22'
};

// using Bootstrap icons - https://icons.getbootstrap.com/
// const IconTemplate = (args: any) => `
//     <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.8.0/font/bootstrap-icons.css" />
//     <style>
//         my-search {
//             --font-size: ${args['--font-size']};
//             --padding: ${args['--padding']};
//         }
//     </style>
//     <my-search label="${args.label}">${args.default}</my-search>
// `;

// export const Icon: any = IconTemplate.bind({});
// Icon.args = {
//     default: "<i class=\"bi bi-search\"></i>"
// };
