const WorkerStrategy = require('egg-schedule/lib/strategy/worker');
const AllStrategy = require('egg-schedule/lib/strategy/all');
const eventLoadSchedules = 'eb:event:loadSchedules';
const eventCheckNeedRunSchedules = 'eb:event:checkNeedRunSchedules';

module.exports = function(loader) {

  // workers
  const workers = {};

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

  loader.app.messenger.on(eventCheckNeedRunSchedules, data => {
    if (!ebScheduleInstances || workers[data.pid]) return;
    // run immediate schedules
    Object.keys(ebScheduleInstances).forEach(key => {
      const strategy = ebScheduleInstances[key];
      const config = strategy.schedule;
      if (!config.disable && config.type === 'all' && config.immediate) {
        loader.app.coreLogger.info(`[egg-schedule] send message to worker ${data.pid}: ${key}`);
        loader.app.messenger.sendTo(data.pid, 'egg-schedule', { key, args: [] });
      }
    });
  });

  loader.app.messenger.on('egg-pids', data => {
    if (ebScheduleInstances) return;
    for (const pid of data) {
      workers[pid] = true;
    }
  });

};
