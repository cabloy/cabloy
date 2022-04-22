const require3 = require('require3');
const boxenFn = require3('boxen');

module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Local {
    get moduleConfig() {
      return ctx.config.module(moduleInfo.relativeName);
    }
    boxen({ text, options }) {
      if (!options) {
        options = this.moduleConfig.helper.boxen.options;
      }
      return boxenFn(text, options);
    }
  }
  return Local;
};
