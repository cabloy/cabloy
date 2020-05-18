module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Schedule extends app.Service {

    async installAllSchedules() {
      this.__installSchedules();
    }

    async scheduleQueue({ module, schedule }) {
      // ignore on test
      if (app.meta.isTest) return;
      // schedule config
      const config = app.meta.configs[module];
      const scheduleConfig = config.schedules[schedule];
      // url
      const url = this.ctx.meta.util.combinePagePath(module, scheduleConfig.path);
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

    __installSchedules() {
      for (const module of app.meta.modulesArray) {
        const config = app.meta.configs[module.info.relativeName];
        // module schedules
        if (config.schedules) {
          Object.keys(config.schedules).forEach(scheduleKey => {
            const fullKey = `${module.info.relativeName}:${scheduleKey}`;
            const scheduleConfig = config.schedules[scheduleKey];
            if (!scheduleConfig.disable && scheduleConfig.repeat) {
              app.meta.queue.push({
                module: moduleInfo.relativeName,
                queueName: 'schedule',
                jobName: fullKey,
                jobOptions: {
                  repeat: scheduleConfig.repeat,
                },
                data: {
                  module: module.info.relativeName,
                  schedule: scheduleKey,
                },
              });
            }
          });
        }
      }
    }

  }

  return Schedule;
};
