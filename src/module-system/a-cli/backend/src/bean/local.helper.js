const { spawn } = require('child_process');
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
    async ensureDir(dir) {
      await fse.ensureDir(dir);
      return dir;
    }
    async lernaBootstrap() {
      await this.console.log('lerna bootstrap ...');
      await this.spawn({
        cmd: 'lerna bootstrap',
        // args: ['--write', fileName],
      });
    }
    async formatFile({ fileName, logPrefix }) {
      try {
        await this.spawn({
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
            err.code = code;
            return reject(err);
          }
          resolve();
        });
      });
    }
  }
  return Local;
};
