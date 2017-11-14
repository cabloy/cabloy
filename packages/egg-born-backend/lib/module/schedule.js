const WorkerStrategy = require('egg-schedule/lib/strategy/worker');
const AllStrategy = require('egg-schedule/lib/strategy/all');

module.exports = function(loader, modules) {

  // all schedules
  const ebSchedules = {};
  const ebScheduleInstances = {};

  // load schedules
  loadSchedules();

  // load in agent
  if (loader.app.meta.inAgent) {

    loader.app.beforeStart(() => {
      Object.keys(ebSchedules).forEach(key => {
        const schedule = ebSchedules[key];
        const config = schedule.schedule;
        if (!config.disable) {
          let Strategy;
          if (config.type === 'worker') Strategy = WorkerStrategy;
          if (config.type === 'all') Strategy = AllStrategy;
          if (!Strategy) {
            const err = new Error(`schedule type [${config.type}] is not defined`);
            err.name = 'EggScheduleError';
            throw err;
          }
          ebScheduleInstances[key] = new Strategy(config, loader.app, key);
        }
      });
    });

    loader.app.messenger.once('egg-ready', () => {
      Object.keys(ebScheduleInstances).forEach(key => {
        const instance = ebScheduleInstances[key];
        instance.start();
      });
    });

  }

  // load in app
  if (loader.app.meta.inApp) {
    Object.keys(ebSchedules).forEach(key => {
      loader.app.schedules[key] = ebSchedules[key];
    });
  }

  function loadSchedules() {
    Object.keys(modules).forEach(key => {
      const module = modules[key];
      // module schedules
      if (module.main.schedules) {
        Object.keys(module.main.schedules).forEach(scheduleKey => {
          const fullKey = `${module.info.fullName}:${scheduleKey}`;
          const scheduleTask = module.main.schedules[scheduleKey];
          const scheduleConfig = loader.app.meta.configs[module.info.fullName].schedules[scheduleKey];
          ebSchedules[fullKey] = {
            schedule: scheduleConfig,
            task: scheduleTask,
            key: fullKey,
          };
        });
      }
    });
  }

};
