const path = require('path');
const fs = require('fs');

// egg-born-bin
const pathEggBornBin = __getPathEggBornBin();
if (!pathEggBornBin) {
  process.exit(0);
}
require(pathEggBornBin);

function __getPathEggBornBin() {
  const basePath = path.join(__dirname, '../');
  let cabloyPath = path.join(basePath, 'node_modules/egg-born-bin/bin/egg-born-bin.js');
  if (fs.existsSync(cabloyPath)) return cabloyPath;
  cabloyPath = path.join(basePath, 'packages/egg-born-bin/bin/egg-born-bin.js');
  if (fs.existsSync(cabloyPath)) return cabloyPath;
  return null;
}
