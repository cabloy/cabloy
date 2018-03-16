const qs = require('querystring');
const eventCheckReady = 'eb:event:version:checkReady';
const eventLoadSchedules = 'eb:event:loadSchedules';
const eventCheckNeedRunSchedules = 'eb:event:checkNeedRunSchedules';

module.exports = function(loader, modules) {

  // all schedules
  const ebSchedules = {};

  // load schedules
  loadSchedules();

  Object.keys(ebSchedules).forEach(key => {
    loader.app.schedules[key] = ebSchedules[key];
  });

  loader.app.messenger.once(eventCheckReady, () => {
    loader.app.messenger.sendToAgent(eventLoadSchedules, ebSchedules);
  });

  loader.app.messenger.sendToAgent(eventCheckNeedRunSchedules, { pid: process.pid });

  // for test purpose
  loader.app.meta.runSchedule = (module, key) => {
    const fullKey = `${module}:${key}`;
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

  function loadSchedules() {
    Object.keys(modules).forEach(key => {
      const module = modules[key];
      // module schedules
      if (module.main.schedules) {
        Object.keys(module.main.schedules).forEach(scheduleKey => {
          const fullKey = `${module.info.relativeName}:${scheduleKey}`;
          const scheduleTask = module.main.schedules[scheduleKey];
          const scheduleConfig = loader.app.meta.configs[module.info.relativeName].schedules[scheduleKey];
          ebSchedules[fullKey] = {
            schedule: scheduleConfig,
            task: wrapTask(scheduleTask, fullKey, scheduleConfig, module.info),
            key: fullKey,
          };
        });
      }
    });
  }

  function wrapTask(task, key, schedule, info) {
    return function() {
      const ctx = loader.app.createAnonymousContext({
        method: 'SCHEDULE',
        url: `/api/${info.url}/__schedule?path=${key}&${qs.stringify(schedule)}`,
      });
      if (!schedule.path) return task(ctx);
      return ctx.performAction({
        method: 'post',
        url: schedule.path,
      });
    };
  }

};
