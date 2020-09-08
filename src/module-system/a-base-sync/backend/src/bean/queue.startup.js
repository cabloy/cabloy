module.exports = ctx => {
  class Queue {

    async execute(context) {
      const { key, startup, info } = context.data;
      // ignore debounce for test
      if (!ctx.app.meta.isTest) {
        const cacheKey = `startupDebounce:${key}`;
        const debounce = typeof startup.debounce === 'number' ? startup.debounce : ctx.app.config.queue.startup.debounce;
        const flag = await this.ctx.cache.db.getset(cacheKey, true, debounce);
        if (flag) return;
      }
      // perform
      await ctx.app.meta._runStartup(ctx, startup, info);
    }

  }

  return Queue;
};
