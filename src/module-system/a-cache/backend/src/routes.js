const version = require('./controller/version.js');
const db = require('./controller/db.js');
const test = require('./controller/test.js');

module.exports = app => {
  let routes = [
    { method: 'post', path: 'version/update', controller: version, middlewares: 'inner' },
    { method: 'post', path: 'db/set', controller: db, middlewares: 'inner',
      meta: { auth: { enable: false } },
    },
  ];
  if (app.meta.isTest || app.meta.isLocal) {
    routes = routes.concat([
      { method: 'get', path: 'test/cachedb', controller: test, middlewares: 'test', meta: { auth: { enable: false } } },
      { method: 'get', path: 'test/cachemem', controller: test, middlewares: 'test', meta: { auth: { enable: false } } },
    ]);
  }
  return routes;
};
