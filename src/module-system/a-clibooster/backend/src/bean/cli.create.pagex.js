const CliCreatePage = require('../common/cliCreatePage.js');

module.exports = ctx => {
  // const moduleInfo = module.info;
  class Cli extends CliCreatePage(ctx, 'pagex') {}
  return Cli;
};
