module.exports = function(loader, modules) {

  // all schedules
  const ebSchedules = loader.app.meta.schedules = {};

  async function __removeAllSchedules() {
    const info = {
      module: 'a-base',
      queueName: 'schedule',
    };
    const queue = loader.app.meta.queue._ensureQueue(info).queue;
    const jobs = await queue.getRepeatableJobs();
    for (const job of jobs) {
      await queue.removeRepeatableByKey(job.key);
    }
  }

  function __installSchedules() {
    for (const module of loader.app.meta.modulesArray) {
      const config = loader.app.meta.configs[module.info.relativeName];
      if (!config.schedules) continue;
      for (const scheduleKey in config.schedules) {
        const fullKey = `${module.info.relativeName}.${scheduleKey}`;
        const scheduleConfig = config.schedules[scheduleKey];
        if (!scheduleConfig.disable && scheduleConfig.repeat) {
          // bean
          const beanName = scheduleConfig.bean;
          if (!beanName) throw new Error(`bean not set for schedule: ${fullKey}`);
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
          ebSchedules[fullKey] = {
            module: module.info.relativeName,
            name: scheduleKey,
            config: scheduleConfig,
            bean,
          };
          // push
          loader.app.meta.queue.push({
            module: 'a-base',
            queueName: 'schedule',
            queueNameSub: fullKey,
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
      }
    }
  }

  loader.app.meta._loadSchedules = async () => {
    await __removeAllSchedules();
    __installSchedules();
  };

};
