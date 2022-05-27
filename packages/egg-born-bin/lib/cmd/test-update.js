const path = require('path');
const globby = require('globby');
const urllib = require('urllib');
const os = require('os');
const assert = require('assert');
const homedir = require('node-homedir');
const compressing = require('compressing');
const rimraf = require('mz-modules/rimraf');
const fse = require('fs-extra');
const chalk = require('chalk');
const semver = require('semver');
const Command = require('@zhennann/egg-bin').Command;

class TestUpdateCommand extends Command {
  constructor(rawArgv) {
    super(rawArgv);
    this.usage = 'Usage: egg-born-bin test-update';

    this.httpClient = urllib.create();
  }

  *run({ cwd, argv }) {
    this.log('update test modules at %s', cwd);

    // detect registry url
    this.registryUrl = this.getRegistryByType(argv.registry);
    this.log(`use registry: ${this.registryUrl}`);

    const projectPath = cwd;
    const moduleName = argv.module;

    if (moduleName) {
      yield this.__updateCabloyModule({ projectPath, moduleName });
    } else {
      yield this.__updateCabloyModules({ projectPath });
    }
  }

  description() {
    return 'test update';
  }

  *__updateCabloyModules({ projectPath }) {
    // force move
    yield this.__forceMoveCabloyModulesToVendor({ projectPath });
    // update
    const prefix = `${projectPath}/src/module-vendor/`;
    const files = globby.sync(`${prefix}test-*`);
    for (const file of files) {
      const moduleName = file.substr(prefix.length);
      yield this.__updateCabloyModule({ projectPath, moduleName });
    }
  }

  *__updateCabloyModule({ projectPath, moduleName }) {
    try {
      const moduleDestDir = path.join(projectPath, 'src/module-vendor', moduleName);
      // check
      const downloadUrl = yield this.__checkCabloyModule({ moduleDestDir, moduleName });
      if (!downloadUrl) {
        // not changed
        console.log(chalk.cyan(`module is up to date: ${moduleName}\n`));
        return;
      }
      // download
      const moduleSrcDir = yield this.__downloadCabloyModule({ downloadUrl, moduleName });
      // move
      yield rimraf(moduleDestDir);
      fse.moveSync(moduleSrcDir, moduleDestDir);
      // done
      console.log(chalk.cyan(`update module done: ${moduleName}\n`));
    } catch (err) {
      console.log(chalk.red(`update module failed and ignored: ${moduleName}\n`));
    }
  }

  *__forceMoveCabloyModulesToVendor({ projectPath }) {
    for (const moduleName of ['test-note', 'test-party', 'test-partymonkey-monkey', 'test-flow']) {
      const moduleSrcDir = path.join(projectPath, 'src/module', moduleName);
      const moduleDestDir = path.join(projectPath, 'src/module-vendor', moduleName);
      if (fse.existsSync(moduleSrcDir)) {
        // move
        yield rimraf(moduleDestDir);
        fse.moveSync(moduleSrcDir, moduleDestDir);
      }
    }
  }

  *__checkCabloyModule({ moduleDestDir, moduleName }) {
    const pkgName = `egg-born-module-${moduleName}`;
    const result = yield this.getPackageInfo(pkgName, false);
    const downloadUrl = result.dist.tarball;
    const version = result.version;

    const _pkgFile = path.join(moduleDestDir, 'package.json');
    if (!fse.existsSync(_pkgFile)) return downloadUrl;

    const _pkg = require(_pkgFile);
    const lt = semver.lt(_pkg.version, version);
    if (!lt) return null;

    return downloadUrl;
  }

  *__downloadCabloyModule({ downloadUrl, moduleName }) {
    const pkgName = `egg-born-module-${moduleName}`;

    this.log(`downloading ${downloadUrl}`);

    const saveDir = path.join(os.tmpdir(), pkgName);
    yield rimraf(saveDir);

    const response = yield this.curl(downloadUrl, { streaming: true, followRedirect: true });
    yield compressing.tgz.uncompress(response.res, saveDir);

    this.log(`extract to ${saveDir}`);
    return path.join(saveDir, '/package');
  }

  /**
   * send curl to remote server
   * @param {String} url - target url
   * @param {Object} [options] - request options
   * @return {Object} response data
   */
  *curl(url, options) {
    return yield this.httpClient.request(url, options);
  }

  /**
   * get package info from registry
   *
   * @param {String} pkgName - package name
   * @param {Boolean} [withFallback] - when http request fail, whethe to require local
   * @return {Object} pkgInfo
   */
  *getPackageInfo(pkgName, withFallback) {
    this.log(`fetching npm info of ${pkgName}`);
    try {
      const result = yield this.curl(`${this.registryUrl}/${pkgName}/latest`, {
        dataType: 'json',
        followRedirect: true,
        maxRedirects: 5,
        timeout: 20000,
      });
      assert(result.status === 200, `npm info ${pkgName} got error: ${result.status}, ${result.data.reason}`);
      return result.data;
    } catch (err) {
      if (withFallback) {
        this.log(`use fallback from ${pkgName}`);
        return require(`${pkgName}/package.json`);
      }
      throw err;
    }
  }

  /**
   * get registryUrl by short name
   * @param {String} key - short name, support `china / npm / npmrc`, default to read from .npmrc
   * @return {String} registryUrl
   */
  getRegistryByType(key) {
    switch (key) {
      case 'china':
        return 'https://registry.npmmirror.com';
      case 'npm':
        return 'https://registry.npmjs.org';
      default: {
        if (/^https?:/.test(key)) {
          return key.replace(/\/$/, '');
        }
        // support .npmrc
        const home = homedir();
        let url = process.env.npm_registry || process.env.npm_config_registry || 'https://registry.npmjs.org';
        if (fse.existsSync(path.join(home, '.cnpmrc')) || fse.existsSync(path.join(home, '.tnpmrc'))) {
          url = 'https://registry.npmmirror.com';
        }
        url = url.replace(/\/$/, '');
        return url;
      }
    }
  }

  /**
   * log with prefix
   */
  log() {
    const args = Array.prototype.slice.call(arguments);
    console.log.apply(console, args);
  }
}

module.exports = TestUpdateCommand;
