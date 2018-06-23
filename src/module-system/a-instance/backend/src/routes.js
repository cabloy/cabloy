const version = require('./controller/version.js');
const test = require('./controller/test.js');

module.exports = [
  { method: 'post', path: 'version/update', controller: version, middlewares: 'inner' },
  { method: 'post', path: 'version/init', controller: version, middlewares: 'inner' },
  { method: 'get', path: 'test/instance', controller: test, middlewares: 'test' },
];
