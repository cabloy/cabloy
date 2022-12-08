const path = require('path');
const fse = require('fs-extra');
const urllib = require('urllib');
const semver = require('semver');
const chalk = require('chalk');
const boxen = require('boxen');
const extend = require('@zhennann/extend');
const eggBornUtils = require('egg-born-utils');

const boxenOptions = { padding: 1, margin: 1, align: 'center', borderColor: 'yellow', borderStyle: 'round' };

const utils = {
  async prepareToken(projectPath, tokenName, options) {
    options = options || {};
    const warnWhenEmpty = options.warnWhenEmpty;
    const token = await eggBornUtils.openAuthConfig.prepareToken(projectPath, tokenName);
    if (!token && warnWhenEmpty) {
      console.log(chalk.red(`Open auth token not found: ${tokenName}`));
      if (!tokenName) {
        const message = `Run ${chalk.keyword('orange')('> npm run test:backend <')} first!`;
        console.log('\n' + boxen(message, boxenOptions) + '\n');
      }
    }
    return token;
  },
  async checkIfDevServerRunning(options) {
    options = options || {};
    const projectPath = options.projectPath;
    const needDevServer = options.needDevServer;
    const warnWhenRunning = options.warnWhenRunning;
    // token
    const token = await eggBornUtils.openAuthConfig.prepareToken(projectPath, null);
    if (!token) return false;
    // OpenAuthClient
    const openAuthClient = new eggBornUtils.OpenAuthClient({ token });
    // echo
    try {
      await openAuthClient.post({
        path: '/a/base/auth/echo',
      });
      if (warnWhenRunning) {
        const message = chalk.keyword('orange')('The backend dev server is running!');
        console.log('\n' + boxen(message, boxenOptions) + '\n');
      }
      return true;
    } catch (err) {
      if (err.status === -1 && (err.address === '::1' || err.address === '127.0.0.1')) {
        if (needDevServer) {
          const message = `Run ${chalk.keyword('orange')('> npm run dev:backend <')} first!`;
          console.log('\n' + boxen(message, boxenOptions) + '\n');
        }
        return false;
      }
      throw err;
      // return true;
    }
  },
  async versionCheck({ moduleName, moduleVersion, scene, mode }) {
    try {
      const httpClient = urllib.create();
      const url = 'https://admin.cabloy.com/api/cabloy/store/util/version';
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
          message += `\nRun ${chalk.keyword('orange')('> lerna bootstrap <')} to install dependencies!`;
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
    return eggBornUtils.tools._getCabloyPath(process.cwd());
  },
  getAppPackage() {
    const cwd = process.cwd();
    return require(path.join(cwd, 'package.json'));
  },
  loadEnvConfig({ baseDir, env }) {
    const fileConfigDefault = path.join(baseDir, 'config/config.default.js');
    const fileConfigEnv = path.join(baseDir, `config/config.${env}.js`);
    if (!fse.existsSync(fileConfigDefault)) {
      console.log(chalk.red('Please copy directory: from _config to config\n'));
      process.exit(0);
    }
    const configDefault = require(fileConfigDefault)({});
    const configEnv = require(fileConfigEnv)({});
    return extend(true, {}, configDefault, configEnv);
  },
  combineTestPattern({ baseDir, env, pattern }) {
    // pattern
    if (!pattern || pattern.length === 0) {
      pattern = ['src/**/backend/test/**/*.test.js'];
    }
    // disabledModules
    const configEnv = this.loadEnvConfig({ baseDir, env });
    const disabledModules = configEnv.disabledModules || [];
    for (const relativeName of disabledModules) {
      pattern.push(`!src/**/${relativeName}/backend/test/**/*.test.js`);
      pattern.push(`!src/**/${relativeName}-sync/backend/test/**/*.test.js`);
      pattern.push(`!src/**/${relativeName}-monkey/backend/test/**/*.test.js`);
    }
    // disabledSuites
    const disabledSuites = configEnv.disabledSuites || [];
    for (const relativeName of disabledSuites) {
      pattern.push(`!src/**/${relativeName}/modules/*/backend/test/**/*.test.js`);
    }
    // cli templates
    pattern.push('!src/**/backend/cli/templates/**/*.test.js');
    // expand glob
    return eggBornUtils.tools.globbySync(pattern);
  },
};
module.exports = utils;
