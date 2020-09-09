module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Queue extends app.meta.BeanBase {

    async execute(context) {
      const { key, startup, info } = context.data;
      // ignore debounce for test
      if (!app.meta.isTest) {
        const cacheKey = `startupDebounce:${key}`;
        const debounce = typeof startup.debounce === 'number' ? startup.debounce : app.config.queue.startup.debounce;
        const cache = this.ctx.cache.db.module(moduleInfo.relativeName);
        const flag = await cache.getset(cacheKey, true, debounce);
        if (flag) return;
      }
      // perform
      await app.meta._runStartup(this.ctx, startup, info);
    }

  }

  return Queue;
};
