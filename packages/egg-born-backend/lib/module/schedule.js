module.exports = function (loader /* , modules*/) {
  // all schedules
  const ebSchedules = (loader.app.meta.schedules = {});

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

  function __installSchedules({ subdomain }) {
    for (const fullKey in ebSchedules) {
      const schedule = ebSchedules[fullKey];
      if (!schedule.config.disable && schedule.config.repeat) {
        // push
        const jobName = `${schedule.module}.${schedule.name}`; // not use :
        loader.app.meta.queue.push({
          subdomain,
          module: 'a-base',
          queueName: 'schedule',
          queueNameSub: fullKey,
          jobName,
          jobOptions: {
            // jobId,
            repeat: schedule.config.repeat,
          },
          data: {
            subdomain,
            module: schedule.module,
            name: schedule.name,
          },
        });
      }
    }
  }

  loader.app.meta._loadSchedules = async ({ subdomain }) => {
    // install
    __installSchedules({ subdomain });
  };

  loader.app.meta._runSchedule = async context => {
    const { subdomain, module, name } = context.data;
    // ignore on test
    if (loader.app.meta.isTest) return;
    // check if valid
    if (!__checkJobValid(context)) {
      await __deleteSchedule(context);
      return;
    }
    // schedule
    const fullKey = `${module}.${name}`;
    const schedule = ebSchedules[fullKey];
    // bean
    const bean = schedule.bean;
    // execute
    return await loader.app.meta.util.executeBean({
      subdomain,
      beanModule: bean.module,
      beanFullName: `${bean.module}.schedule.${bean.name}`,
      transaction: schedule.config.transaction,
      context,
    });
  };

  async function __deleteSchedule(context) {
    const job = context.job;
    const jobKeyActive = getRepeatKey(job.data.jobName, job.data.jobOptions.repeat);
    const repeat = await job.queue.repeat;
    await repeat.removeRepeatableByKey(jobKeyActive);
  }

  function __checkJobValid(context) {
    const job = context.job;
    const { module, name } = context.data;
    // schedule
    const fullKey = `${module}.${name}`;
    const schedule = ebSchedules[fullKey];
    if (!schedule) return false;
    // check disable
    if (schedule.config.disable) return false;
    // check if changed
    const jobKeyActive = getRepeatKey(job.data.jobName, job.data.jobOptions.repeat);
    const jobKeyConfig = getRepeatKey(job.data.jobName, schedule.config.repeat);
    if (jobKeyActive !== jobKeyConfig) return false;
    // ok
    return true;
  }
};

function getRepeatKey(name, repeat) {
  const endDate = repeat.endDate ? new Date(repeat.endDate).getTime() : '';
  const tz = repeat.tz || '';
  const suffix = (repeat.cron ? repeat.cron : String(repeat.every)) || '';

  return `${name}::${endDate}:${tz}:${suffix}`;
}
