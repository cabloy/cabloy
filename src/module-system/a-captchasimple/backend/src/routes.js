const version = require('./controller/version.js');
const simple = require('./controller/simple.js');

module.exports = app => {
  const routes = [
    // version
    { method: 'post', path: 'version/update', controller: version, middlewares: 'inner' },
    { method: 'post', path: 'version/init', controller: version, middlewares: 'inner' },
    { method: 'post', path: 'version/test', controller: version, middlewares: 'test' },
    // simple
    { method: 'get', path: 'simple/getCaptcha', controller: simple, middlewares: 'captchaContainer' },
  ];
  return routes;
};
