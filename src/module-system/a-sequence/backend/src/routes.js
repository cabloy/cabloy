const version = require('./controller/version.js');
const sequence = require('./controller/sequence.js');
const test = require('./controller/test.js');

module.exports = app => {
  let routes = [
    { method: 'post', path: 'version/update', controller: version, middlewares: 'inner' },
    { method: 'post', path: 'sequence/next', controller: sequence, middlewares: 'inner', meta: { auth: { enable: false } } },
  ];
  if (app.meta.isTest || app.meta.isLocal) {
    routes = routes.concat([
      { method: 'get', path: 'test/sequence', controller: test, middlewares: 'test' },
    ]);
  }
  return routes;
};
