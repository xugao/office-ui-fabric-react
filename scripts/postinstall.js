const { spawnSync } = require('child_process');
const chalk = require('chalk');

// git v2.9.0 supports a custom hooks directory. This means we just need to checkin the hooks scripts
spawnSync('git', ['config', 'core.hooksPath', '.githooks']);

console.log(`${chalk.green('All dependencies are installed! This repo no longer require a build to start innerloop.')}
For innerloop development, run this command:
  ${chalk.yellow('yarn start')}
`);
