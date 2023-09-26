const chalk = require('chalk');
const Table = require('cli-table3');
const eggBornUtils = require('egg-born-utils');

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

    async delete({ name, log }) {
      // init file
      const { fileName, config } = await eggBornUtils.openAuthConfig.load();
      // config
      if (config.tokens && config.tokens[name]) {
        // delete
        delete config.tokens[name];
        // save
        await eggBornUtils.openAuthConfig.save({ config });
      }
      // log
      if (log) {
        console.log(chalk.cyan(`\n  ${fileName}\n`));
      }
      // ok
      return { fileName, config };
    }

    async get({ name }) {
      // init file
      const { config } = await eggBornUtils.openAuthConfig.load();
      return config.tokens && config.tokens[name];
    }

    async list({ log }) {
      // init file
      const { fileName, config } = await eggBornUtils.openAuthConfig.load();
      // log
      if (log) {
        // tokens
        if (!config.tokens) config.tokens = {};
        const table = new Table({
          head: ['Token Name', 'Host'],
          colWidths: [30, 50],
        });
        for (const tokenName in config.tokens) {
          const token = config.tokens[tokenName];
          table.push([tokenName, token.host]);
        }
        console.log(table.toString());
        // fileName
        console.log(chalk.cyan(`\n  ${fileName}\n`));
      }
      // ok
      return { fileName, config };
    }
  }
  return Local;
};
