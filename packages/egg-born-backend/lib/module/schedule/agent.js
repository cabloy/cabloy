const WorkerStrategy = require('egg-schedule/lib/strategy/worker');
const AllStrategy = require('egg-schedule/lib/strategy/all');
const eventLoadSchedules = 'eb:event:loadSchedules';

module.exports = function(loader) {

  // all schedules
  let ebScheduleInstances;

  loader.app.messenger.once(eventLoadSchedules, ebSchedules => {
    if (ebScheduleInstances) return;
    ebScheduleInstances = {};
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
        ebScheduleInstances[key].start();
      }
    });
  });

};
