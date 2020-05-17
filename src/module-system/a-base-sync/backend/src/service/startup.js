module.exports = app => {
  class Startup extends app.Service {

    async startupQueue({ key, startup, info }) {
      // ignore debounce for test
      if (!app.meta.isTest) {
        const cacheKey = `startupDebounce:${key}`;
        const debounce = typeof startup.debounce === 'number' ? startup.debounce : app.config.queue.startup.debounce;
        const flag = await this.ctx.cache.db.getset(cacheKey, true, debounce);
        if (flag) return;
      }
      // perform
      await app.meta._runStartup(this.ctx, startup, info);
    }

  }

  return Startup;
};
