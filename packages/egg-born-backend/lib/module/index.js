const loadMeta = require('./meta.js');
const ModulesToolsFn = require('./module.js');
const loadRoutes = require('./route.js');
const loadControllers = require('./controller.js');
const loadServices = require('./service.js');
const loadModels = require('./model.js');
const loadConfig = require('./config.js');
const loadModuleMeta = require('./moduleMeta.js');
const loadLocales = require('./locales.js');
const loadErrors = require('./errors.js');
const loadConstants = require('./constant.js');
const loadMessenger = require('./messenger.js');
const loadRedis = require('./redis.js');
const loadQueues = require('./queue/queue.js');
const loadBroadcasts = require('./broadcast/broadcast.js');
const loadStartups = require('./startup.js');
const loadSchedules = require('./schedule.js');
const loadSocketio = require('./socketio.js');
const loadClusterApp = require('./cluster/app.js');
const loadClusterAgent = require('./cluster/agent.js');
const loadBeans = require('./bean/index.js');

module.exports = function (loader) {
  // meta
  const meta = loadMeta(loader);

  // messenger
  loadMessenger(loader);

  // modules
  const modulesTools = ModulesToolsFn(loader);
  // load modules
  const modules = modulesTools.loadModules();
  // monkey modules
  modulesTools.monkeyModules('moduleLoading');

  if (meta.inApp) {
    loadConfig(loader, modules);
    loadModuleMeta(loader, modules);
    loadLocales(loader, modules);
    loadErrors(loader, modules);
    loadConstants(loader, modules);
    loadBeans(loader, modules);
    loadRoutes(loader, modules);
    loadControllers(loader, modules);
    loadServices(loader, modules);
    loadModels(loader, modules);
    loadRedis(loader, modules);
    loadQueues(loader, modules);
    loadBroadcasts(loader, modules);
    loadStartups(loader, modules);
    loadSchedules(loader, modules);
    loadSocketio(loader, modules);
    loadClusterApp(loader, modules);
  } else {
    loadConfig(loader, modules);
    loadClusterAgent(loader, modules);
  }

  // monkey modules
  modulesTools.monkeyModules('moduleLoaded');
};
