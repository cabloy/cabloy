const { spawn } = require('child_process');
const path = require('path');
const require3 = require('require3');
const Chalk = require3('chalk');
const TableClass = require3('cli-table3');
const Boxen = require3('boxen');
const fse = require3('fs-extra');
const mparse = require3('egg-born-mparse').default;

module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Local {
    constructor(cli) {
      this.cli = cli;
    }

    get options() {
      return this.cli.options;
    }

    get context() {
      return this.cli.options.context;
    }

    get console() {
      return this.cli.console;
    }

    get template() {
      return this.cli.template;
    }

    get moduleConfig() {
      return ctx.config.module(moduleInfo.relativeName);
    }
    get chalk() {
      return this.newChalk();
    }
    get Table() {
      return TableClass;
    }
    newChalk(options) {
      if (!options) {
        options = this.moduleConfig.helper.chalk.options;
      }
      return new Chalk.Instance(options);
    }
    newTable(options) {
      return new TableClass(options);
    }
    boxen({ text, options }) {
      if (!options) {
        options = this.moduleConfig.helper.boxen.options;
      }
      return Boxen(text, options);
    }
    parseModuleInfo(moduleName) {
      const moduleInfo = mparse.parseInfo(moduleName);
      if (!moduleInfo) throw new Error(`module name is not valid: ${moduleName}`);
      return moduleInfo;
    }
    findModule(moduleName) {
      const moduleInfo = this.parseModuleInfo(moduleName);
      return ctx.app.meta.modules[moduleInfo.relativeName];
    }
    parseSuiteInfo(suiteName) {
      const suiteInfo = mparse.parseInfo(suiteName, 'suite');
      if (!suiteInfo) throw new Error(`suite name is not valid: ${suiteName}`);
      return suiteInfo;
    }
    findSuite(suiteName) {
      const suiteInfo = this.parseSuiteInfo(suiteName);
      return ctx.app.meta.suites[suiteInfo.relativeName];
    }
    async ensureDir(dir) {
      await fse.ensureDir(dir);
      return dir;
    }
    getNpmRegistry() {
      let registry = this.context.env.npm_config_registry;
      if (!registry) {
        const locale = ctx.locale === 'zh-cn' ? 'zh-cn' : 'en-us';
        registry = this.moduleConfig.helper.lerna.registry.locales[locale];
      }
      return registry;
    }
    async lernaBootstrap() {
      // args
      const args = ['bootstrap'];
      // registry
      const registry = this.getNpmRegistry();
      const registryOption = registry ? `--registry=${registry}` : '';
      if (registryOption) {
        args.push(registryOption);
      }
      // log
      await this.console.log(`===> lerna bootstrap ${registryOption}`);
      // spawn
      await this.spawnCmd({
        cmd: 'lerna',
        args,
      });
    }
    async formatFile({ fileName, logPrefix }) {
      try {
        await this.spawnBin({
          cmd: 'prettier',
          args: ['--write', fileName],
          options: {
            logPrefix,
          },
        });
      } catch (err) {
        if (err.code === 2) {
          // not throw error
          return;
        }
        throw err;
      }
    }
    async spawnBin({ cmd, args, options }) {
      cmd = path.join(this.context.cwd, 'node_modules/.bin', cmd);
      return await this.spawnCmd({ cmd, args, options });
    }
    async spawnCmd({ cmd, args, options }) {
      if (/^win/.test(process.platform)) {
        cmd = `${cmd}.cmd`;
      }
      return await this.spawn({ cmd, args, options });
    }
    async spawnExe({ cmd, args, options }) {
      if (/^win/.test(process.platform)) {
        cmd = `${cmd}.exe`;
      }
      return await this.spawn({ cmd, args, options });
    }
    async spawn({ cmd, args = [], options = {} }) {
      if (!options.cwd) {
        options.cwd = this.context.cwd;
      }
      return new Promise((resolve, reject) => {
        const logPrefix = options.logPrefix;
        const proc = spawn(cmd, args, options);
        proc.stdout.on('data', async data => {
          await this.console.log({ text: data.toString() }, { logPrefix });
        });
        proc.stderr.on('data', async data => {
          await this.console.log({ text: data.toString() }, { logPrefix });
        });
        proc.once('exit', code => {
          if (code !== 0) {
            const err = new Error(`spawn ${cmd} ${args.join(' ')} fail, exit code: ${code}`);
            err.code = 10000 + code;
            return reject(err);
          }
          resolve();
        });
      });
    }
    async gitCommit({ cwd, message }) {
      // git add .
      await this.helper.spawnExe({
        cmd: 'git',
        args: ['add', '.'],
        options: {
          cwd,
        },
      });
      // git commit
      await this.helper.spawnExe({
        cmd: 'git',
        args: ['commit', '-m', message],
        options: {
          cwd,
        },
      });
      // git push
      await this.helper.spawnExe({
        cmd: 'git',
        args: ['push'],
        options: {
          cwd,
        },
      });
    }
  }
  return Local;
};
