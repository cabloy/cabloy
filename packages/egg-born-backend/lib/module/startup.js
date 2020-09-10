const qs = require('querystring');

module.exports = function(loader) {

  // use modulesArray
  const ebModulesArray = loader.app.meta.modulesArray;

  // all startups
  const ebStartups = loader.app.meta.startups = {};
  const ebStartupsArray = loader.app.meta.startupsArray = [];

  // load startups
  loadStartups();

  function loadStartups() {
    for (const module of ebModulesArray) {
      const config = loader.app.meta.configs[module.info.relativeName];
      if (!config.startups) continue;
      for (const startupKey in config.startups) {
        const startupConfig = config.startups[startupKey];
        const fullKey = `${module.info.relativeName}:${startupKey}`;
        // bean
        const beanName = startupConfig.bean;
        if (!beanName) throw new Error(`bean not set for startup: ${fullKey}`);
        let bean;
        if (typeof beanName === 'string') {
          bean = {
            module: module.info.relativeName,
            name: beanName,
          };
        } else {
          bean = {
            module: beanName.module || module.info.relativeName,
            name: beanName.name,
          };
        }
        ebStartups[fullKey] = {
          module: module.info.relativeName,
          name: startupKey,
          config: startupConfig,
          bean,
        };
        ebStartupsArray.push(ebStartups[fullKey]);
      }
    }
  }

  // for test purpose
  loader.app.meta._runStartup = async ({ module, name }) => {
    const fullKey = `${module}:${name}`;
    const startup = ebStartups[fullKey];
    // normal
    if (!startup.config.debounce) {
      return await loader.app.meta._runStartupQueue({ module, name });
    }
    // debounce: queue
    await loader.app.meta.queue.pushAsync({
      module: 'a-base',
      queueName: 'startup',
      queueNameSub: fullKey,
      data: startup,
    });
  };

  loader.app.meta._runStartupQueue = async ({ module, name }) => {
    // schedule
    const fullKey = `${module}:${name}`;
    const startup = ebStartups[fullKey];
    // bean
    const bean = startup.bean;
    // execute
    return await loader.app.meta.util.executeBeanInstance({
      // locale, context,
      beanModule: bean.module,
      beanFullName: `${bean.module}.startup.${bean.name}`,
      transaction: startup.config.transaction,
      instance: startup.config.instance,
    });
  };

};
