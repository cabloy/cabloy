const require3 = require('require3');
const Chalk = require3('chalk');
const TableClass = require3('cli-table3');
const Boxen = require3('boxen');

module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Local {
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
  }
  return Local;
};
