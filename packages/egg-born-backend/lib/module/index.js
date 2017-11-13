const loadRoutes = require('./route.js');
const loadServices = require('./service.js');
const loadConfig = require('./config.js');
const loadLocales = require('./locales.js');
const loadErrors = require('./errors.js');
const loadConstants = require('./constant.js');
const util = require('./util.js');

module.exports = function(loader) {

  if (!loader.app.meta) loader.app.meta = {};
  const modules = loader.app.meta.modules = util.parseModules(loader);

  loadRoutes(loader, modules);
  loadServices(loader, modules);
  loadConfig(loader, modules);
  loadLocales(loader, modules);
  loadErrors(loader, modules);
  loadConstants(loader, modules);

};
