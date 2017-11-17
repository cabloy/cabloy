const routes = require('./routes.js');
const services = require('./services.js');
const config = require('./config/config.js');
const locales = require('./config/locales.js');
const errors = require('./config/errors.js');
const constants = require('./config/constants.js');
const schedules = require('./config/schedules.js');

// eslint-disable-next-line
module.exports = app => {

  if (app.meta.isTest) {
    app.messenger.once('egg-ready', () => {
      const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
      app.meta.runSchedule(`${moduleInfo.fullName}:versionCheck`);
    });
  }

  return {
    routes,
    services,
    config,
    locales,
    errors,
    constants,
    schedules,
  };

};
