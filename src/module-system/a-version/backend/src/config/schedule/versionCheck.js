const require3 = require('require3');
const chalk = require3('chalk');

module.exports = async function(ctx) {
  const eventCheckReady = ctx.constant.event.checkReady;

  try {
    await ctx.performAction({
      method: 'post',
      url: 'version/check',
    });
    console.log(chalk.cyan('  All modules are checked successfully!'));
  } catch (err) {
    console.log(chalk.cyan('  Modules are checked failed!'));
  }

  // emit event
  if (ctx.app.meta.isTest) {
    ctx.app.emit(eventCheckReady);
  } else {
    console.log(chalk.yellow('  For more details, please goto http://{ip}:{port}/#/a/version/check\n'));
    ctx.app.messenger.sendToApp(eventCheckReady);
  }
};
