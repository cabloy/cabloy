const version = require('./controller/version.js');
const message = require('./controller/message.js');

module.exports = app => {
  const routes = [
    // version
    { method: 'post', path: 'version/update', controller: version, middlewares: 'inner' },
    { method: 'post', path: 'version/init', controller: version, middlewares: 'inner' },
    { method: 'post', path: 'version/test', controller: version, middlewares: 'test' },
    // message
    { method: 'get', path: 'message/index', controller: message, meta: { auth: { enable: false } } },
    { method: 'post', path: 'message/index', controller: message, meta: { auth: { enable: false } } },
  ];
  return routes;
};
