module.exports = async function(app) {
  // run immediate schedules
  for (const key in app.meta.schedules) {
    const schedule = app.meta.schedules[key];
    const config = schedule.schedule;
    if (!config.disable && config.type === 'all' && config.immediate) {
      app.coreLogger.info(`[egg-schedule] send message to worker ${process.pid}: ${key}`);
      await app.meta.runSchedule(key);
    }
  }
};
