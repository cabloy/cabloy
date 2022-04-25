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
  }
  return Local;
};
