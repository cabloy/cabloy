module.exports = ctx => {
  class Queue {

    async execute(context) {
      const { module, schedule } = context.data;
      // ignore on test
      if (ctx.app.meta.isTest) return;
      // schedule config
      const config = ctx.app.meta.configs[module];
      const scheduleConfig = config.schedules[schedule];
      // url
      const url = ctx.bean.util.combinePagePath(module, scheduleConfig.path);
      // performAction
      if (!scheduleConfig.instance) {
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
    }

  }

  return Queue;
};
