const version = require('./controller/version.js');

module.exports = [
  { method: 'post', path: 'version/databaseInitStartup', controller: version, middlewares: 'inner', meta: { instance: { enable: false }, auth: { enable: false } } },
  { method: 'post', path: 'version/databaseInitQueue', controller: version, middlewares: 'inner', meta: { instance: { enable: false }, auth: { enable: false } } },
  { method: 'post', path: 'version/start', controller: version, middlewares: 'inner', meta: { instance: { enable: false }, auth: { enable: false } } },
  { method: 'post', path: 'version/check', controller: version, middlewares: 'inner', meta: { instance: { enable: false }, auth: { enable: false } } },
  { method: 'post', path: 'version/updateModule', controller: version, middlewares: 'inner,transaction', meta: { instance: { enable: false }, auth: { enable: false } } },
  { method: 'post', path: 'version/initModule', controller: version, middlewares: 'inner,transaction', meta: { instance: { enable: false }, auth: { enable: false } } },
  { method: 'post', path: 'version/testModule', controller: version, middlewares: 'inner,transaction', meta: { instance: { enable: false }, auth: { enable: false } } },
  { method: 'post', path: 'version/update', controller: version, middlewares: 'inner', meta: { instance: { enable: false }, auth: { enable: false } } },
  { method: 'post', path: 'version/after', controller: version, middlewares: 'inner', meta: { auth: { enable: false } } },
];
