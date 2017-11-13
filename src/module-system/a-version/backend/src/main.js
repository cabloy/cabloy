const chalk = require('chalk');
const routes = require('./routes.js');
const services = require('./services.js');
const config = require('./config/config.js');
const locales = require('./config/locales.js');
const errors = require('./config/errors.js');
const constants = require('./config/constants.js');

// eslint-disable-next-line
module.exports = app => {

  app.messenger.once('egg-ready', () => {
    versionCheck(app);
  });

  return {
    routes,
    services,
    config,
    locales,
    errors,
    constants: constants(app),
  };

};

function versionCheck(app) {

  const moduleInfo = app.mockUtil.parseInfoFromPackage(__dirname);
  const prefix = app.mockUtil.parseUrlFromPackage(__dirname);

  const eventCheckReady = app.constants[moduleInfo.fullName].event.checkReady;

  if (app.config.env === 'unittest') {
    return app.httpRequest().post(`${prefix}/version/check`).then(result => {
      if (result.body && result.body.code === 0) {
        console.log(chalk.cyan('  All modules are checked successfully!'));
      } else {
        console.log(chalk.cyan('  Modules are checked failed!'));
      }

      // emit event
      app.emit(eventCheckReady);
    });

  } else if (app.config.env === 'local') {
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

      // emit event
      app.emit(eventCheckReady);
    });

  }

  // prod
  // just emit event
  app.emit(eventCheckReady);

}
