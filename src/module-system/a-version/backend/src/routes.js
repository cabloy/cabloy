const version = require('./controller/version.js');

module.exports = [
  { method: 'post', path: 'version/start', controller: version, middlewares: 'inner' },
  { method: 'post', path: 'version/check', controller: version, middlewares: 'inner' },
  { method: 'post', path: 'version/updateModule', controller: version, middlewares: 'inner,transaction' },
  { method: 'post', path: 'version/initModule', controller: version, middlewares: 'inner,transaction' },
  { method: 'post', path: 'version/testModule', controller: version, middlewares: 'inner' },
  { method: 'post', path: 'version/update', controller: version, middlewares: 'inner' },
];
