const version = require('./controller/version.js');
const util = require('./controller/util.js');

module.exports = app => {
  const routes = [
    // version
    { method: 'post', path: 'version/update', controller: 'version', middlewares: 'inner' },
    { method: 'post', path: 'version/init', controller: 'version', middlewares: 'inner' },
    { method: 'post', path: 'version/test', controller: 'version', middlewares: 'test' },
    // util
    { method: 'get', path: 'util/md/:atomId', controller: 'util', action: 'md' },
  ];
  return routes;
};
