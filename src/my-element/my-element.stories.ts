import "./index";

export default {
    title: 'Components/My Element',
    component: 'my-element',
    args: {
    },
    // parameters: {
    //     actions: {
    //         handles: ['find'],
    //     },
    // },
};

const Template = (args: any) => `
    <my-element></my-element>
`;

export const Default: any = Template.bind({});
Default.args = {};

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
