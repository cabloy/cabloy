const qs = require('querystring');
const uuid = require('uuid');
const eventVersionCheck = 'eb:event:versionCheck';
const eventVersionCheckReady = 'eb:event:versionCheckReady';
const eventVersionReady = 'eb:event:versionReady';
const eventVersionReadyAsk = 'eb:event:versionReadyAsk';

module.exports = function(loader, modules) {

  // ready
  let _ready = false;
  // pids
  let _pids = null;

  // egg-ready
  loader.app.messenger.once('egg-ready', async () => {
    // inner cookie
    loader.app.meta.__innerCookie = uuid.v4();
    // queue ready
    await loader.app.meta.queue.ready();
    // version check ready
    loader.app.messenger.once(eventVersionCheckReady, info => {
      // queue app
      loader.app.meta.__app = info.app;
      // version ready
      loader.app.messenger.sendToApp(eventVersionReady, { innerCookie: loader.app.meta.__innerCookie });
      // ready
      _ready = true;
    });
    // version check
    if (loader.app.meta.isTest || !_pids) { // support init:backend
      loader.app.messenger.sendToApp(eventVersionCheck);
    } else {
      loader.app.messenger.sendRandom(eventVersionCheck);
    }
  });

  // check if version ready for worker
  loader.app.messenger.on(eventVersionReadyAsk, pid => {
    if (_ready) {
      loader.app.messenger.sendTo(pid, eventVersionReady, { innerCookie: loader.app.meta.__innerCookie });
    }
  });

  // get pids
  loader.app.messenger.on('egg-pids', data => {
    _pids = data;
  });

};
