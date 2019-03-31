const qs = require('querystring');
const WorkerStrategy = require('egg-schedule/lib/strategy/worker');
const AllStrategy = require('egg-schedule/lib/strategy/all');
const util = require('./util.js');
const constant = require('../base/constants.js');

module.exports = function(loader, modules) {

  // all schedules
  const ebSchedules = loader.app.meta.schedules = loadSchedules();
  const ebScheduleInstances = {};

  // for app
  if (loader.app.meta.inApp) {
    // load to app
    Object.keys(ebSchedules).forEach(key => {
      loader.app.schedules[key] = ebSchedules[key];
    });

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
  } else {
    // for agent
    if (!loader.app.meta.isTest) {
      // event:appReady
      loader.app.on(constant.event.appReady, () => {
        // start schedules
        startSchedules();
      });
    }
  }

  function startSchedules() {
    Object.keys(ebSchedules).forEach(key => {
      const schedule = ebSchedules[key];
      const config = schedule.schedule;
      if (!config.disable && (config.interval || config.cron || config.immediate)) {
        let Strategy;
        if (config.type === 'worker') Strategy = WorkerStrategy;
        if (config.type === 'all') Strategy = AllStrategy;
        if (!Strategy) {
          const err = new Error(`schedule type [${config.type}] is not defined`);
          err.name = 'EggScheduleError';
          throw err;
        }
        ebScheduleInstances[key] = new Strategy(config, loader.app, key);
        ebScheduleInstances[key].start();
      }
    });
  }

  function loadSchedules() {
    const ebSchedules = {};
    Object.keys(modules).forEach(key => {
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
    });
    return ebSchedules;
  }

  function wrapTask(key, schedule, info) {
    return function(ctx) {
      const url = util.combineApiPath(info, schedule.path);
      if (!schedule.instance) {
        return ctx.performAction({
          method: 'post',
          url,
        });
      }
      // all instances
      return ctx.db.query('select * from aInstance a where a.disabled=0').then(instances => {
        const list = [];
        for (const instance of instances) {
          list.push(
            ctx.performAction({
              subdomain: instance.name,
              method: 'post',
              url,
            })
          );
        }
        return Promise.all(list);
      });
    };
  }

};
