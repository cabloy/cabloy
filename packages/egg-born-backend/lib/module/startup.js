const qs = require('querystring');
const util = require('./util.js');

module.exports = function(loader) {

  // use modulesArray
  const ebModulesArray = loader.app.meta.modulesArray;

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

  loader.app.meta._runStartup = async (ctx, startup, info) => {
    const url = util.combineApiPath(info, startup.path);
    if (!startup.instance) {
      return await ctx.performAction({
        method: 'post',
        url,
      });
    }
    // all instances
    const instances = await ctx.db.query('select * from aInstance a where a.disabled=0');
    for (const instance of instances) {
      await ctx.performAction({
        subdomain: instance.name,
        method: 'post',
        url,
      });
    }
  };

  function loadStartups() {
    for (const module of ebModulesArray) {
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
    }
  }

  function wrapTask(key, startup, info) {
    return async function(ctx) {
      // normal
      if (!startup.debounce) {
        return await loader.app.meta._runStartup(ctx, startup, info);
      }
      // debounce: queue
      await loader.app.meta.queue.pushAsync({
        module: 'a-base',
        queueName: 'startup',
        data: { key, startup, info },
      });
    };
  }

};
