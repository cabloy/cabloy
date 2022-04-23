const require3 = require('require3');
const chalk = require3('chalk');
const eggBornUtils = require3('egg-born-utils');

module.exports = ctx => {
  // const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Local {
    async add({ name, host, clientID, clientSecret, log }) {
      // init file
      const { fileName, config } = await eggBornUtils.openAuthConfig.load();
      // config
      if (!config.tokens) config.tokens = {};
      config.tokens[name] = {
        host,
        clientID,
        clientSecret,
      };
      // save
      await eggBornUtils.openAuthConfig.save({ config });
      // log
      if (log) {
        console.log(chalk.cyan(`\n  ${fileName}\n`));
      }
      // ok
      return { fileName, config };
    }
  }
  return Local;
};
