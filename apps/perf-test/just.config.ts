const perfTest = require('./tasks/perf-test');
const compareScenarioResults = require('./tasks/compareScenarioResults');
const { preset, just } = require('@uifabric/build');
const { task, series } = just;

preset();

task('run-perf-test', perfTest);
task('perf-test', series('build', 'bundle', 'run-perf-test'));
task('compare', compareScenarioResults);
