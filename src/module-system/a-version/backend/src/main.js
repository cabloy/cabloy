const chalk = require('chalk');
const routes = require('./routes.js');
const services = require('./services.js');
const config = require('./config/config.js');
const locales = require('./config/locales.js');
const errors = require('./config/errors.js');
const constants = require('./config/constants.js');

// eslint-disable-next-line
module.exports = app => {

  if (app.meta.inApp && app.config.env === 'unittest') {
    app.messenger.once('egg-ready', () => {
      versionCheck(app, true);
    });
  }
  if (app.meta.inAgent && app.config.env !== 'unittest') {
    app.messenger.once('egg-ready', () => {
      versionCheck(app, false);
    });
  }

  return {
    routes,
    services,
    config,
    locales,
    errors,
    constants,
  };

};

function versionCheck(app, inApp) {

  const moduleInfo = app.mockUtil.parseInfoFromPackage(__dirname);
  const prefix = app.mockUtil.parseUrlFromPackage(__dirname);

  const eventCheckReady = app.meta.constants[moduleInfo.fullName].event.checkReady;

  // in app
  if (inApp) {
    return app.httpRequest().post(`${prefix}/version/check`).then(result => {
      if (result.body && result.body.code === 0) {
        console.log(chalk.cyan('  All modules are checked successfully!'));
      } else {
        console.log(chalk.cyan('  Modules are checked failed!'));
      }

      // emit event
      app.emit(eventCheckReady);
    });
  }

  // in agent
  const listen = app.config.cluster.listen;
  return app.curl(`http://${listen.hostname}:${listen.port}${prefix}/version/check`, {
    method: 'POST',
    contentType: 'json',
    dataType: 'json',
  }).then(result => {
    if (result.data && result.data.code === 0) {
      console.log(chalk.cyan('  All modules are checked successfully!'));
    } else {
      console.log(chalk.cyan('  Modules are checked failed!'));
    }
    console.log(chalk.yellow('  For more details, please goto http://{ip}:{port}/#/a/version/check\n'));

    // emit event to workers from agent
    app.messenger.sendToApp(eventCheckReady);
  });

}
