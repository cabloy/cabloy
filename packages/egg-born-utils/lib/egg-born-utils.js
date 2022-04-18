const os = require('os');
const path = require('path');
const fse = require('fs-extra');

module.exports = {
  readOpenAuth,
};

async function readOpenAuth() {
  // fileName
  const fileName = path.join(os.homedir(), '.cabloy', 'openauth.json');
  // config
  let config;
  const exists = await fse.pathExists(fileName);
  if (!exists) {
    config = {};
  } else {
    const content = await fse.readFile(fileName);
    config = JSON.parse(content);
  }
  // ok
  return { fileName, config };
}
