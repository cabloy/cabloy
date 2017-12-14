const version = require('./controller/version.js');

module.exports = [
  { method: 'post', path: 'version/update', controller: version, middlewares: 'safeAccess' },
  { method: 'post', path: 'version/init', controller: version, middlewares: 'safeAccess' },
  { method: 'post', path: 'version/test', controller: version, middlewares: 'safeAccess' },
];
