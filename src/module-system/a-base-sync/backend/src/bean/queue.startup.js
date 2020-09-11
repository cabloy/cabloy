module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Queue extends app.meta.BeanBase {

    async execute(context) {
      const { startup, instanceStartup } = context.data;
      // ignore debounce for test
      const force = instanceStartup ? instanceStartup.options.force : false;
      if (!force && !app.meta.isTest) {
        const fullKey = `${startup.module}:${startup.name}`;
        const cacheKey = `startupDebounce:${fullKey}`;
        const debounce = typeof startup.config.debounce === 'number' ? startup.config.debounce : app.config.queue.startup.debounce;
        const cache = this.ctx.cache.db.module(moduleInfo.relativeName);
        const flag = await cache.getset(cacheKey, true, debounce);
        if (flag) return;
      }
      // perform
      await app.meta._runStartupQueue({ module: startup.module, name: startup.name, instanceStartup });
    }

  }

  return Queue;
};
