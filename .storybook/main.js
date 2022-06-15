module.exports = {
  stories: ['../src/**/*stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-a11y',
    '@storybook/addon-actions',
    '@storybook/addon-controls',
    '@storybook/addon-links',
  ],
  framework: '@storybook/web-components',
  core: {
    builder: '@storybook/builder-vite',
  },
};
