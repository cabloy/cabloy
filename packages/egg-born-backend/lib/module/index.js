const loadRoutes = require('./route.js');
const loadServices = require('./service.js');
const loadConfig = require('./config.js');
const loadLocales = require('./locales.js');
const loadErrors = require('./errors.js');
const loadConstants = require('./constant.js');
const loadSchedules = require('./schedule.js');

const util = require('./util.js');

module.exports = function(loader) {

  // meta
  if (!loader.app.meta) loader.app.meta = {};

  // app or agent
  loader.app.meta.inApp = loader.app.type === 'application';
  loader.app.meta.inAgent = loader.app.type === 'agent';

  // modules
  const modules = loader.app.meta.modules = util.parseModules(loader);

  // load in app
  if (loader.app.meta.inApp) {
    loadRoutes(loader, modules);
    loadServices(loader, modules);
    loadConfig(loader, modules);
    loadLocales(loader, modules);
    loadErrors(loader, modules);
    loadConstants(loader, modules);
    loadSchedules(loader, modules);
  }

  // load in agent
  if (loader.app.meta.inAgent) {
    loadConfig(loader, modules);
    loadConstants(loader, modules);
    loadSchedules(loader, modules);
  }

};
