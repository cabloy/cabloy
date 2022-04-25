const { spawn } = require('child_process');
const require3 = require('require3');
const Chalk = require3('chalk');
const TableClass = require3('cli-table3');
const Boxen = require3('boxen');
const fse = require3('fs-extra');

module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Local {
    constructor(cli) {
      this.cli = cli;
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
    async ensureDir(dir) {
      await fse.ensureDir(dir);
      return dir;
    }
    async formatFile({ fileName, logPrefix }) {
      await this.spawn({
        cmd: 'prettier',
        args: ['--write', fileName],
        options: {
          logPrefix,
        },
      });
    }
    async spawn({ cmd, args = [], options = {} }) {
      const logPrefix = options.logPrefix;
      return new Promise((resolve, reject) => {
        const proc = spawn(cmd, args, options);
        proc.stdout.on('data', async data => {
          await this.console.log({ text: data.toString() }, { logPrefix });
        });
        proc.stderr.on('data', async data => {
          await this.console.log({ text: data.toString() }, { logPrefix });
        });
        proc.once('exit', code => {
          if (code !== 0) {
            return reject(new Error(`spawn ${cmd} ${args.join(' ')} fail, exit code: ${code}`));
          }
          resolve();
        });
      });
    }
  }
  return Local;
};
