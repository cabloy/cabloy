const version = require('./controller/version.js');
const io = require('./controller/io.js');

module.exports = app => {
  const routes = [
    // version
    { method: 'post', path: 'version/update', controller: version, middlewares: 'inner' },
    { method: 'post', path: 'version/init', controller: version, middlewares: 'inner' },
    { method: 'post', path: 'version/test', controller: version, middlewares: 'test' },
    // io
    { method: 'post', path: 'subscribe', controller: io, middlewares: 'io' },
    { method: 'post', path: 'unsubscribe', controller: io, middlewares: 'io' },

  ];
  return routes;
};
