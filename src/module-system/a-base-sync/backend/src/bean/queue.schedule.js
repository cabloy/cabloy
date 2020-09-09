module.exports = app => {
  class Queue extends app.meta.BeanBase {

    async execute(context) {
      const { module, schedule } = context.data;
      // ignore on test
      if (app.meta.isTest) return;
      // schedule config
      const config = app.meta.configs[module];
      const scheduleConfig = config.schedules[schedule];
      console.log('---------- schedule:', schedule, new Date());
      return;
      // url
      const url = this.ctx.bean.util.combinePagePath(module, scheduleConfig.path);
      // performAction
      if (!scheduleConfig.instance) {
        return await this.ctx.performAction({
          method: 'post',
          url,
        });
      }
      // all instances
      const instances = await this.ctx.db.query('select * from aInstance a where a.disabled=0');
      for (const instance of instances) {
        await this.ctx.performAction({
          subdomain: instance.name,
          method: 'post',
          url,
        });
      }
    }

  }

  return Queue;
};
