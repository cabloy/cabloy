const qs = require('querystring');

module.exports = function(loader, modules) {

  return loadSchedules();

  function loadSchedules() {
    const ebSchedules = {};
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
    return ebSchedules;
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
