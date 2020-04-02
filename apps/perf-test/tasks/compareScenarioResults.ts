const { argv } = require('@uifabric/build').just;
const fs = require('fs-extra');
const path = require('path');

module.exports = () => {
  const { r1, r2, tag } = argv();

  console.log(`Compare ${[r1, r2].join(', ')}`);

  const result1 = JSON.parse(fs.readFileSync(r1));
  const result2 = JSON.parse(fs.readFileSync(r2));

  const scenarios = new Set([].concat(Object.keys(result1)).concat(Object.keys(result2)));

  const compareResult = {};
  Array.from(scenarios).forEach(scenario => {
    const raw1 = result1[scenario];
    const numTicks1 = raw1 && raw1.analysis.numTicks;

    const raw2 = result2[scenario];
    const numTicks2 = raw1 && raw2.analysis.numTicks;

    const delta = numTicks1 - numTicks2;
    const percent = ((delta / numTicks2) * 100).toFixed(2);
    compareResult[scenario] = {
      numTicks1,
      numTicks2,
      delta,
      percent: `${percent}%`,
    };
  });

  const fileName = tag ? `comparison-${tag}` : `comparison`;
  const resultFilePath = path.join(__dirname, '../reports', `${fileName}.json`);
  fs.writeFileSync(resultFilePath, JSON.stringify(compareResult, null, 2));
};
