const { spawn } = require('child_process');
const path = require('path');

const Chalk = require('chalk');
const TableClass = require('cli-table3');
const Boxen = require('boxen');
const fse = require('fs-extra');
const mparse = require('egg-born-mparse').default;

module.exports = ctx => {
  const moduleInfo = module.info;
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
    get cwd() {
      return this.context.cwd;
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
      let registry = this.cli.terminal ? this.context.env.npm_config_registry : null;
      if (!registry) {
        const locale = ctx.locale === 'zh-cn' ? 'zh-cn' : 'en-us';
        registry = this.moduleConfig.helper.lerna.registry.locales[locale];
      }
      return registry;
    }
    async lernaBootstrap() {
      // args
      const args = ['install'];
      // registry
      const registry = this.getNpmRegistry();
      const registryOption = registry ? `--registry=${registry}` : '';
      if (registryOption) {
        args.push(registryOption);
      }
      // log
      await this.console.log(`===> npm install ${registryOption}`);
      // spawn
      await this.spawnCmd({
        cmd: 'npm',
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
      cmd = path.join(this.cwd, 'node_modules/.bin', cmd);
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
        options.cwd = this.cwd;
      }
      return new Promise((resolve, reject) => {
        const logPrefix = options.logPrefix;
        const proc = spawn(cmd, args, options);
        let stdout = '';
        // let stderr = '';
        proc.stdout.on('data', async data => {
          stdout += data.toString();
          await this.console.log({ text: data.toString() }, { logPrefix });
        });
        proc.stderr.on('data', async data => {
          // stderr += data.toString();
          await this.console.log({ text: data.toString() }, { logPrefix });
        });
        proc.once('exit', code => {
          if (code !== 0) {
            const err = new Error(`spawn ${cmd} ${args.join(' ')} fail, exit code: ${code}`);
            err.code = 10000 + code;
            return reject(err);
          }
          resolve(stdout);
        });
      });
    }
    async gitCommit({ cwd, message }) {
      // git status
      const stdout = await this.spawnExe({
        cmd: 'git',
        args: ['status'],
        options: {
          cwd,
        },
      });
      if (stdout.indexOf('nothing to commit, working tree clean') > -1 && stdout.indexOf('is ahead of') === -1) {
        // do nothing
        return;
      }
      if (stdout.indexOf('is ahead of') === -1) {
        // git add .
        await this.spawnExe({
          cmd: 'git',
          args: ['add', '.'],
          options: {
            cwd,
          },
        });
        // git commit
        await this.spawnExe({
          cmd: 'git',
          args: ['commit', '-m', message],
          options: {
            cwd,
          },
        });
      }
      // git push
      await this.spawnExe({
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
