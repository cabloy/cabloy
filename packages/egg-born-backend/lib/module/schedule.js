module.exports = function(loader, modules) {

  // all schedules
  const ebSchedules = loader.app.meta.schedules = {};

  // load schedules
  loadSchedules();

  function loadSchedules() {
    for (const module of loader.app.meta.modulesArray) {
      const config = loader.app.meta.configs[module.info.relativeName];
      if (!config.schedules) continue;
      for (const scheduleKey in config.schedules) {
        const fullKey = `${module.info.relativeName}.${scheduleKey}`;
        const scheduleConfig = config.schedules[scheduleKey];
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
      }
    }
  }

  async function __removeAllSchedules() {
    const info = {
      module: 'a-base',
      queueName: 'schedule',
    };
    const queue = loader.app.meta.queue._ensureQueue(info).queue;
    const jobs = await queue.getRepeatableJobs();
    // console.log(jobs);
    for (const job of jobs) {
      await queue.removeRepeatableByKey(job.key);
    }
  }

  function __installSchedules() {
    for (const fullKey in ebSchedules) {
      const schedule = ebSchedules[fullKey];
      if (!schedule.config.disable && schedule.config.repeat) {
        // push
        const jobId = `_schedule.${fullKey}`;
        loader.app.meta.queue.push({
          module: 'a-base',
          queueName: 'schedule',
          queueNameSub: fullKey,
          jobName: jobId,
          jobOptions: {
            jobId,
            repeat: schedule.config.repeat,
          },
          data: {
            module: schedule.module,
            name: schedule.name,
          },
        });
      }
    }
  }

  loader.app.meta._loadSchedules = async () => {
    await __removeAllSchedules();
    __installSchedules();
  };

  loader.app.meta._runSchedule = async ({ module, name }) => {
    // ignore on test
    if (loader.app.meta.isTest) return;
    // schedule
    const fullKey = `${module}.${name}`;
    const schedule = ebSchedules[fullKey];
    // bean
    const bean = schedule.bean;
    // execute
    return await loader.app.meta.util.executeBeanInstance({
      // locale, context,
      beanModule: bean.module,
      beanFullName: `${bean.module}.schedule.${bean.name}`,
      transaction: schedule.config.transaction,
      instance: schedule.config.instance,
    });
  };
};
