const qs = require('querystring');
const WorkerStrategy = require('egg-schedule/lib/strategy/worker');
const AllStrategy = require('egg-schedule/lib/strategy/all');
const loadSchedules = require('./schedules.js');
const eventVersionCheck = 'eb:event:versionCheck';
const eventVersionCheckReady = 'eb:event:versionCheckReady';
const eventVersionReady = 'eb:event:versionReady';
const eventVersionReadyAsk = 'eb:event:versionReadyAsk';

module.exports = function(loader, modules) {

  // ready
  let _ready = false;
  // pids
  let _pids = null;

  // all schedules
  const ebSchedules = loadSchedules(loader, modules);

  // egg-ready
  loader.app.messenger.once('egg-ready', () => {
    // version check ready
    loader.app.messenger.once(eventVersionCheckReady, () => {
      // start schedules
      startSchedules();
      // version ready
      loader.app.messenger.sendToApp(eventVersionReady);
      // ready
      _ready = true;
    });
    // version check
    if (loader.app.meta.isTest || !_pids) {
      loader.app.messenger.sendToApp(eventVersionCheck);
    } else {
      loader.app.messenger.sendRandom(eventVersionCheck);
    }
  });

  // check if version ready for worker
  loader.app.messenger.on(eventVersionReadyAsk, pid => {
    if (_ready) {
      loader.app.messenger.sendTo(pid, eventVersionReady);
    }
  });

  // get pids
  loader.app.messenger.on('egg-pids', data => {
    _pids = data;
  });

  // start schedules
  let ebScheduleInstances;
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

};
