const URL = require('url').URL;

module.exports = function (loader) {
  loader.app.beforeStart(() => {
    loader.app.io.checkRequest = checkRequest;
  });

  function checkRequest(req, fn) {
    // not cors (safari not send sec-fetch-mode)
    // if (req.headers['sec-fetch-mode'] !== 'cors') return fn(null, true);

    // origin
    let origin = req.headers.origin || req.headers.referer;

    // file:// URLs produce a null Origin which can't be authorized via echo-back
    if (origin === 'null' || origin === null) origin = '*';
    if (!origin || origin === '*') return fn(null, true);

    const host = req.headers['x-forwarded-host'] || req.headers.host;
    if (new URL(origin).host === host) {
      return fn(null, true);
    }

    // check
    const ctx = loader.app.createAnonymousContext(req, {
      method: 'SOCKETIO',
      url: '/api/a/base/',
    });
    ctx.bean.instance
      .checkAppReadyInstance({ startup: true })
      .then(res => {
        if (!res) return fn(null, false);
        if (loader.app.meta.util.isSafeDomain(ctx, origin)) {
          return fn(null, true);
        }
        return fn(null, false);
      })
      .catch(() => {
        return fn(null, false);
      });
  }
};
