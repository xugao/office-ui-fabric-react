// your app's webpack.config.js
const custom = require('@uifabric/build/config/storybook/webpack.config');

module.exports = {
  webpackFinal: config => custom({ config })
};
