module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Schedule extends app.Service {

    async installAllSchedules() {
      this.__installSchedules();
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
