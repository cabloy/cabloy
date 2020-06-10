const version = require('./controller/version.js');
const message = require('./controller/message.js');
const event = require('./controller/event.js');
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
    { method: 'get', path: 'message/index', controller: message, middlewares: 'wxwork', meta: { auth: { enable: false } } },
    { method: 'post', path: 'message/index', controller: message, middlewares: 'wxwork', meta: { auth: { enable: false } } },
    { method: 'get', path: 'message/contacts', controller: message, middlewares: 'wxwork', meta: { auth: { enable: false } } },
    { method: 'post', path: 'message/contacts', controller: message, middlewares: 'wxwork', meta: { auth: { enable: false } } },
    // jsapi
    { method: 'post', path: 'jssdk/jsconfig', controller: jssdk, middlewares: 'wechat' },
    // event
    { method: 'post', path: 'event/loginInfo', controller: event, middlewares: 'inner', meta: { auth: { enable: false } } },

    // messageMini
    { method: 'get', path: 'messageMini/index', controller: messageMini, middlewares: 'wechatMini', meta: { auth: { enable: false } } },
    { method: 'post', path: 'messageMini/index', controller: messageMini, middlewares: 'wechatMini', meta: { auth: { enable: false } } },
    // authMini
    { method: 'post', path: 'authMini/login', controller: authMini, middlewares: 'wechatMini', meta: { auth: { enable: false } } },

  ];
  return routes;
};
