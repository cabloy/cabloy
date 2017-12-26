const loadRoutes = require('./route.js');
const loadMeta = require('./meta.js');
const loadServices = require('./service.js');
const loadModels = require('./model.js');
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
  loadRoutes(loader, modules);
  loadServices(loader, modules);
  loadModels(loader, modules);
  loadSchedules(loader, modules);

};
