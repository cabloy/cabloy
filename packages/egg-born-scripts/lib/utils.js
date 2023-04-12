const path = require('path');
const fs = require('fs');
const urllib = require('urllib');
const semver = require('semver');
const chalk = require('chalk');
const boxen = require('boxen');

const boxenOptions = { padding: 1, margin: 1, align: 'center', borderColor: 'yellow', borderStyle: 'round' };

const utils = {
  async versionCheck({ moduleName, moduleVersion, scene, mode }) {
    try {
      const httpClient = urllib.create();
      const url = 'https://portal.cabloy.com/api/cabloy/store/util/version';
      const options = {
        method: 'POST',
        data: {
          moduleName,
          moduleVersion,
          scene,
          mode,
        },
        dataType: 'json',
        followRedirect: true,
        maxRedirects: 5,
        timeout: 20000,
      };
      const res = await httpClient.request(url, options);
      return res.data.data;
    } catch (err) {
      // console.log(err);
      return null;
    }
  },
  async versionCheckCabloy({ scene }) {
    try {
      // cabloy
      const cabloyPath = this.__getCabloyPath();
      if (!cabloyPath) return;
      const _pkg = require(path.join(cabloyPath, 'package.json'));
      // moduleVersion
      const moduleVersion = _pkg.version;
      // mode
      const mode = cabloyPath.indexOf('packages') > -1 ? 'lerna' : '';
      // versionCheck
      const moduleVersionCurrent = await this.versionCheck({ moduleName: 'cabloy', moduleVersion, scene, mode });
      if (!moduleVersionCurrent) return;
      // prompt
      this.versionPromptCabloy({ mode, moduleName: 'cabloy', moduleVersion, moduleVersionCurrent });
    } catch (err) {
      console.log(err);
    }
  },
  versionPromptCabloy({ mode, moduleName, moduleVersion, moduleVersionCurrent }) {
    try {
      const lt = semver.lt(moduleVersion, moduleVersionCurrent);
      if (!lt) return;
      setTimeout(() => {
        // log
        let message = `[${chalk.keyword('cyan')(moduleName)}] new version available: ${chalk.keyword('yellow')(
          moduleVersion
        )} → ${chalk.keyword('orange')(moduleVersionCurrent)}`;
        if (mode === 'lerna') {
          message += `\nRun ${chalk.keyword('orange')('> git pull <')} to update cabloy!`;
          message += `\nRun ${chalk.keyword('orange')('> npm install <')} to install dependencies!`;
        } else {
          // message += `\nRun ${chalk.keyword('orange')('> npm update <')} to update cabloy!`;
          // message += `\nRun ${chalk.keyword('orange')('> npm run update:test <')} to update the test modules!`;
        }
        console.log('\n' + boxen(message, boxenOptions));
      }, 6000);
    } catch (err) {
      console.log(err);
    }
  },
  getModulePath(moduleName) {
    const moduleFile = require.resolve(`${moduleName}/package.json`);
    return path.dirname(moduleFile);
  },
  __getCabloyPath() {
    const cwd = process.cwd();
    let cabloyPath = path.join(cwd, 'node_modules/cabloy');
    if (fs.existsSync(cabloyPath)) return cabloyPath;
    cabloyPath = path.join(cwd, 'packages/cabloy');
    if (fs.existsSync(cabloyPath)) return cabloyPath;
    return null;
  },
  getAppPackage() {
    const cwd = process.cwd();
    return require(path.join(cwd, 'package.json'));
  },
};
module.exports = utils;
