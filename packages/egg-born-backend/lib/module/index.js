const loadMiddlewares = require('./middleware.js');
const loadRoutes = require('./route.js');
const loadMeta = require('./meta.js');
const loadServices = require('./service.js');
const loadConfig = require('./config.js');
const loadLocales = require('./locales.js');
const loadErrors = require('./errors.js');
const loadConstants = require('./constant.js');
const loadSchedules = require('./schedule/app.js');

const util = require('./util.js');

module.exports = function(loader) {

  // meta
  const meta = loadMeta(loader);

  // modules
  const modules = meta.modules = util.parseModules(loader);

  loadConfig(loader, modules);
  loadLocales(loader, modules);
  loadErrors(loader, modules);
  loadConstants(loader, modules);
  loadMiddlewares(loader, modules);
  loadRoutes(loader, modules);
  loadServices(loader, modules);
  loadSchedules(loader, modules);

};
