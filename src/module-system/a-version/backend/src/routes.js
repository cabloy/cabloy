const version = require('./controller/version.js');

module.exports = [
  { method: 'post', path: 'version/start', controller: version, middlewares: 'safeAccess' },
  { method: 'post', path: 'version/check', controller: version, middlewares: 'safeAccess' },
  { method: 'post', path: 'version/updateModule', controller: version, middlewares: 'safeAccess,transaction' },
  { method: 'post', path: 'version/initModule', controller: version, middlewares: 'safeAccess,transaction' },
  { method: 'post', path: 'version/testModule', controller: version, middlewares: 'safeAccess,transaction' },
  { method: 'post', path: 'version/update', controller: version, middlewares: 'safeAccess' },
  { method: 'get', path: 'version/result', controller: version, middlewares: 'safeAccess' },
];
