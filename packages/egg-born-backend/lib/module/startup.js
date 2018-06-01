const qs = require('querystring');
const util = require('./util.js');

module.exports = function(loader, modules) {

  // all startups
  const ebStartups = loader.app.meta.startups = {};

  // load startups
  loadStartups();

  // for test purpose
  loader.app.meta.runStartup = (module, key) => {
    const fullKey = key === undefined ? module : `${module}:${key}`;
    const startup = ebStartups[fullKey];
    if (!startup) {
      throw new Error(`Cannot find startup ${fullKey}`);
    }
    // run with anonymous context
    const ctx = loader.app.createAnonymousContext({
      method: 'STARTUP',
      url: `/__startup?path=${fullKey}&${qs.stringify(startup.startup)}`,
    });
    return startup.task(ctx);
  };

  function loadStartups() {
    Object.keys(modules).forEach(key => {
      const module = modules[key];
      const config = loader.app.meta.configs[module.info.relativeName];
      // module startups
      if (config.startups) {
        Object.keys(config.startups).forEach(startupKey => {
          const fullKey = `${module.info.relativeName}:${startupKey}`;
          const startupConfig = config.startups[startupKey];
          ebStartups[fullKey] = {
            startup: startupConfig,
            task: wrapTask(fullKey, startupConfig, module.info),
            key: fullKey,
          };
        });
      }
    });
  }

  function wrapTask(key, startup, info) {
    return function(ctx) {
      return ctx.performAction({
        method: 'post',
        url: util.combineApiPath(info, startup.path),
      });
    };
  }

};
