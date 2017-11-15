const loadRoutes = require('./route.js');
const loadMeta = require('./meta.js');
const loadServices = require('./service.js');
const loadConfig = require('./config.js');
const loadLocales = require('./locales.js');
const loadErrors = require('./errors.js');
const loadConstants = require('./constant.js');
const loadSchedules = require('./schedule.js');

const util = require('./util.js');

module.exports = function(loader) {

  // meta
  const meta = loadMeta(loader);

  // modules
  const modules = meta.modules = util.parseModules(loader);

  // load in app
  if (meta.inApp) {
    loadRoutes(loader, modules);
    loadServices(loader, modules);
    loadConfig(loader, modules);
    loadLocales(loader, modules);
    loadErrors(loader, modules);
    loadConstants(loader, modules);
    loadSchedules(loader, modules);
  }

  // load in agent
  if (meta.inAgent) {
    loadConfig(loader, modules);
    loadConstants(loader, modules);
    loadSchedules(loader, modules);
  }

};
