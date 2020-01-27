// @ts-check

const { task, series, parallel, condition, option, argv, addResolvePath, resolveCwd } = require('just-scripts');

const path = require('path');
const fs = require('fs');

const { clean } = require('./tasks/clean');
const { copy } = require('./tasks/copy');
const { jest, jestWatch } = require('./tasks/jest');
const { sass } = require('./tasks/sass');
const { ts } = require('./tasks/ts');
const { tslint } = require('./tasks/tslint');
const { webpack, webpackDevServer } = require('./tasks/webpack');
const { verifyApiExtractor, updateApiExtractor } = require('./tasks/api-extractor');
const lintImports = require('./tasks/lint-imports');
const prettier = require('./tasks/prettier');
const bundleSizeCollect = require('./tasks/bundle-size-collect');
const checkForModifiedFiles = require('./tasks/check-for-modified-files');
const generateVersionFiles = require('./tasks/generate-version-files');
const generatePackageManifestTask = require('./tasks/generate-package-manifest');
const { postprocessTask } = require('./tasks/postprocess');
const { postprocessAmdTask } = require('./tasks/postprocess-amd');
const { postprocessCommonjsTask } = require('./tasks/postprocess-commonjs');
const { startStorybookTask, buildStorybookTask } = require('./tasks/storybookTask');

/** Do only the bare minimum setup of options and resolve paths */
function basicPreset() {
  // this adds a resolve path for the build tooling deps like TS from the scripts folder
  addResolvePath(__dirname);

  option('production');

  option('webpackConfig', { alias: 'w' });

  // Build only commonjs (not other TS variants) but still run other tasks
  option('commonjs');

  option('cached', { default: false });
}

module.exports = function preset() {
  basicPreset();

  task('clean', clean);
  task('copy', copy);
  task('jest', jest);
  task('jest-watch', jestWatch);
  task('sass', sass);
  task('ts:postprocess', postprocessTask());
  task('postprocess:amd', postprocessAmdTask);
  task('postprocess:commonjs', postprocessCommonjsTask);
  task('ts:commonjs', ts.commonjs);
  task('ts:esm', ts.esm);
  task('ts:amd', series(ts.amd, 'postprocess:amd'));
  task('tslint', tslint);
  task('ts:commonjs-only', ts.commonjsOnly);
  task('webpack', webpack);
  task('webpack-dev-server', webpackDevServer);
  task('api-extractor:verify', verifyApiExtractor);
  task('api-extractor:update', updateApiExtractor);
  task('lint-imports', lintImports);
  task('prettier', prettier);
  task('bundle-size-collect', bundleSizeCollect);
  task('check-for-modified-files', checkForModifiedFiles);
  task('generate-version-files', generateVersionFiles);
  task('generate-package-manifest', generatePackageManifestTask);
  task('storybook:start', startStorybookTask());
  task('storybook:build', buildStorybookTask());

  task('ts:compile', () => {
    return argv().commonjs ? 'ts:commonjs-only' : parallel('ts:commonjs', 'ts:esm', condition('ts:amd', () => !!argv().production));
  });

  task('ts', series('ts:compile', 'ts:postprocess'));

  task('test', condition('jest', () => fs.existsSync(path.join(process.cwd(), 'jest.config.js'))));

  task('lint', parallel('lint-imports', 'tslint'));

  task('code-style', series('prettier', 'tslint'));
  task('update-api', series('clean', 'copy', 'sass', 'ts', 'api-extractor:update'));

  task('dev:storybook', series('clean', 'copy', 'sass', 'storybook:start'));
  task('dev', series('clean', 'copy', 'sass', 'webpack-dev-server'));

  task('build:node-lib', series('clean', 'copy', 'ts:commonjs-only')).cached();

  task(
    'build',
    series(
      'clean',
      'copy',
      'sass',
      'ts',
      condition('api-extractor:verify', () => fs.existsSync(path.join(process.cwd(), 'config/api-extractor.json')))
    )
  ).cached();

  task(
    'bundle',
    parallel(
      condition('webpack', () => !!resolveCwd('webpack.config.js')),
      condition('storybook:build', () => !!resolveCwd('./.storybook/main.js'))
    )
  );

  task('no-op', () => {}).cached();
};

module.exports.basic = basicPreset;
