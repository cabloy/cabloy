const qs = require('querystring');
const database = require('./database.js');
const versionCheck = require('./versionCheck.js');
const versionReady = require('./versionReady.js');
const eventVersionCheck = 'eb:event:versionCheck';
const eventVersionCheckReady = 'eb:event:versionCheckReady';
const eventVersionReady = 'eb:event:versionReady';
const eventVersionReadyAsk = 'eb:event:versionReadyAsk';
const eventAppReady = 'eb:event:appReady';

module.exports = function(loader, modules) {

  let _versionReady = false;

  // version check
  loader.app.messenger.once(eventVersionCheck, async () => {
    await database(loader.app);
    await versionCheck(loader.app);
    const info = {};
    if (loader.app.meta.isTest) info.app = loader.app; // send to agent: app
    loader.app.messenger.sendToAgent(eventVersionCheckReady, info);
  });

  // version ready
  loader.app.messenger.once(eventVersionReady, async info => {
    if (!_versionReady) {
      _versionReady = true;
      // inner cookie
      loader.app.meta.__innerCookie = info.innerCookie;
      // queue ready
      await loader.app.meta.queue.ready();
      // database
      await database(loader.app);
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

};
