const CliCreatePage = require('../common/cliCreatePage.js');

module.exports = ctx => {
  // const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Cli extends CliCreatePage(ctx, 'pagex') {}
  return Cli;
};
