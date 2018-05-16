const loadRoutes = require('./route.js');
const loadMeta = require('./meta.js');
const loadServices = require('./service.js');
const loadModels = require('./model.js');
const loadConfig = require('./config.js');
const loadLocales = require('./locales.js');
const loadErrors = require('./errors.js');
const loadConstants = require('./constant.js');
const loadSchedulesApp = require('./schedule/app.js');
const loadQueuesApp = require('./queue/app.js');
const loadQueuesAgent = require('./queue/agent.js');
const loadSchedulesAgent = require('./schedule/agent.js');

const util = require('./util.js');

module.exports = function(loader) {

  // meta
  const meta = loadMeta(loader);

  // modules
  const modules = meta.modules = util.parseModules(loader);

  if (meta.inApp) {
    loadConfig(loader, modules);
    loadLocales(loader, modules);
    loadErrors(loader, modules);
    loadConstants(loader, modules);
    loadRoutes(loader, modules);
    loadServices(loader, modules);
    loadModels(loader, modules);
    loadQueuesApp(loader, modules);
    loadSchedulesApp(loader, modules);
  } else {
    loadConfig(loader, modules);
    loadQueuesAgent(loader, modules);
    loadSchedulesAgent(loader, modules);
  }

};
