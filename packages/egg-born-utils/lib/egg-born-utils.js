const os = require('os');
const path = require('path');
const fse = require('fs-extra');

const openAuthConfig = {
  _fileName: null,
  async load() {
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
    this._fileName = fileName;
    return { fileName, config };
  },
  async save({ fileName, config }) {
    await fse.outputFile(fileName || this._fileName, JSON.stringify(config, null, 2));
  },
};
module.exports = {
  openAuthConfig,
};
