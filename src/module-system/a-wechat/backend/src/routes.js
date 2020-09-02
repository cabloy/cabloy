const version = require('./controller/version.js');
const message = require('./controller/message.js');
const jssdk = require('./controller/jssdk.js');
const messageMini = require('./controller/messageMini.js');
const authMini = require('./controller/authMini.js');

module.exports = app => {
  const routes = [
    // version
    { method: 'post', path: 'version/update', controller: version, middlewares: 'inner' },
    { method: 'post', path: 'version/init', controller: version, middlewares: 'inner' },
    { method: 'post', path: 'version/test', controller: version, middlewares: 'test' },
    // message
    { method: 'get', path: 'message/index', controller: message, middlewares: 'wechat', meta: { auth: { enable: false } } },
    { method: 'post', path: 'message/index', controller: message, middlewares: 'wechat', meta: { auth: { enable: false } } },
    // jsapi
    { method: 'post', path: 'jssdk/jsconfig', controller: jssdk, middlewares: 'wechat' },

    // messageMini
    { method: 'get', path: 'messageMini/:scene', controller: messageMini, action: 'index', middlewares: 'wechat', meta: { auth: { enable: false } } },
    { method: 'post', path: 'messageMini/:scene', controller: messageMini, action: 'index', middlewares: 'wechat', meta: { auth: { enable: false } } },
    // authMini
    { method: 'post', path: 'authMini/login', controller: authMini, middlewares: 'wechat', meta: { auth: { enable: false } } },

  ];
  return routes;
};
