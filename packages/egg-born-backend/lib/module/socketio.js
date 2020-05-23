module.exports = function(loader) {

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
    if (host && origin.indexOf(host) > -1) return fn(null, true);

    // check
    const url = '/api/a/base/';
    const ctx = loader.app.createAnonymousContext({
      method: 'SOCKETIO',
      url,
    });
    if (loader.app.meta.util.isSafeDomain(ctx, origin)) {
      return fn(null, true);
    }
    return fn(null, false);
  }

};

