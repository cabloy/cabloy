const version = require('./controller/version.js');
const status = require('./controller/status.js');
const test = require('./controller/test.js');

module.exports = app => {
  let routes = [
    { method: 'post', path: 'version/update', controller: version, middlewares: 'inner' },
    { method: 'post', path: 'status/set', controller: status, middlewares: 'inner',
      meta: { auth: { enable: false } },
    },
  ];
  if (app.meta.isTest || app.meta.isLocal) {
    routes = routes.concat([
      { method: 'get', path: 'test/status', controller: test, middlewares: 'test' },
    ]);
  }
  return routes;
};
