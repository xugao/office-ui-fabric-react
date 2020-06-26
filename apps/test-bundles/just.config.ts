const { preset, just } = require('@uifabric/build');
const { task, resolveCwd } = just;
const { run } = require('parallel-webpack');

preset();

task('bundle', done => {
  run(resolveCwd('webpack.config.js'), {}, done);
});
