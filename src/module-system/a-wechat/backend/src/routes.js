module.exports = app => {
  const routes = [
    // version
    { method: 'post', path: 'version/update', controller: 'version', middlewares: 'inner' },
    { method: 'post', path: 'version/init', controller: 'version', middlewares: 'inner' },
    { method: 'post', path: 'version/test', controller: 'version', middlewares: 'test' },
    // message
    { method: 'get', path: 'message/index', controller: 'message', meta: { auth: { enable: false } } },
    { method: 'post', path: 'message/index', controller: 'message', meta: { auth: { enable: false } } },
    // jsapi
    { method: 'post', path: 'jssdk/jsconfig', controller: 'jssdk' },

    // messageMini
    { method: 'get', path: 'messageMini/:scene', controller: 'messageMini', action: 'index', meta: { auth: { enable: false } } },
    { method: 'post', path: 'messageMini/:scene', controller: 'messageMini', action: 'index', meta: { auth: { enable: false } } },
    // authMini
    { method: 'post', path: 'authMini/login', controller: 'authMini', meta: { auth: { enable: false } } },

  ];
  return routes;
};
