const qs = require('querystring');
const loadSchedules = require('./schedules.js');
const versionCheck = require('./versionCheck.js');
const versionReady = require('./versionReady.js');
const eventVersionCheck = 'eb:event:versionCheck';
const eventVersionCheckReady = 'eb:event:versionCheckReady';
const eventVersionReady = 'eb:event:versionReady';
const eventVersionReadyAsk = 'eb:event:versionReadyAsk';
const eventAppReady = 'eb:event:appReady';

module.exports = function(loader, modules) {

  // all schedules
  const ebSchedules = loader.app.meta.schedules = loadSchedules(loader, modules);

  // load to app
  Object.keys(ebSchedules).forEach(key => {
    loader.app.schedules[key] = ebSchedules[key];
  });

  // version check
  loader.app.messenger.once(eventVersionCheck, async () => {
    await versionCheck(loader.app);
    loader.app.messenger.sendToAgent(eventVersionCheckReady);
  });

  // version ready
  let _versionReady = false;
  loader.app.messenger.once(eventVersionReady, async () => {
    if (!_versionReady) {
      _versionReady = true;
      // version ready
      await versionReady(loader.app);
      // event: appReady
      loader.app.emit(eventAppReady);
    }
  });

  // egg-ready
  loader.app.messenger.once('egg-ready', () => {
    loader.app.messenger.sendToAgent(eventVersionReadyAsk, process.pid);
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

};
