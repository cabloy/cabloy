const qs = require('querystring');
const util = require('./util.js');
const constant = require('../base/constants.js');

module.exports = function(loader, modules) {

  // all schedules
  const ebSchedules = loader.app.meta.schedules = {};

  // load schedules
  loadSchedules();

  // for test purpose
  loader.app.meta.runSchedule = (module, key) => {
    const fullKey = key === undefined ? module : `${module}:${key}`;
    const schedule = ebSchedules[fullKey];
    if (!schedule) {
      throw new Error(`Cannot find schedule ${fullKey}`);
    }
    // run with anonymous context
    const ctx = loader.app.createAnonymousContext({
      method: 'SCHEDULE',
      url: `/__schedule?path=${fullKey}&${qs.stringify(schedule.schedule)}`,
    });
    return schedule.task(ctx);
  };

  // startSchedules
  if (!loader.app.meta.isTest) {
    // event:appReady
    loader.app.on(constant.event.appReady, () => {
      // start schedules
      startSchedules();
    });
  }

  function startSchedules() {
    for (const key in ebSchedules) {
      const schedule = ebSchedules[key];
      const config = schedule.schedule;
      if (!config.disable && config.repeat) {
        loader.app.meta.queue.push({
          queueName: '__schedule',
          queueConfig: {},
          jobName: key,
          jobOptions: {
            repeat: config.repeat,
          },
          data: {
            scheduleKey: key,
          },
        });
      }
    }
  }

  function loadSchedules() {
    for (const key in modules) {
      const module = modules[key];
      const config = loader.app.meta.configs[module.info.relativeName];
      // module schedules
      if (config.schedules) {
        Object.keys(config.schedules).forEach(scheduleKey => {
          const fullKey = `${module.info.relativeName}:${scheduleKey}`;
          const scheduleConfig = config.schedules[scheduleKey];
          ebSchedules[fullKey] = {
            schedule: scheduleConfig,
            task: wrapTask(fullKey, scheduleConfig, module.info),
            key: fullKey,
          };
        });
      }
    }
  }

  function wrapTask(key, schedule, info) {
    return async function(ctx) {
      const url = util.combineApiPath(info, schedule.path);
      if (!schedule.instance) {
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
    };
  }

};
