const os = require('os');
const path = require('path');
const fse = require('fs-extra');

// openAuthConfig
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
  async prepareToken(projectPath, tokenName) {
    if (!projectPath) projectPath = process.cwd();
    // tokenName
    tokenName = this.prepareTokenName(projectPath, tokenName);
    // init file
    const { config } = await this.load();
    return config.tokens && config.tokens[tokenName];
  },
  prepareTokenName(projectPath, tokenName) {
    if (tokenName) return tokenName;
    const pkg = require(path.join(projectPath, 'package.json'));
    return `clidev@${pkg.name}`;
  },
};

module.exports = openAuthConfig;
