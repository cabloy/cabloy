const version = require('./controller/version.js');
const progress = require('./controller/progress.js');

module.exports = app => {
  const routes = [
    // version
    { method: 'post', path: 'version/update', controller: version, middlewares: 'inner' },
    { method: 'post', path: 'version/init', controller: version, middlewares: 'inner' },
    { method: 'post', path: 'version/test', controller: version, middlewares: 'test' },
    // progress
    { method: 'post', path: 'progress/check', controller: progress, meta: { auth: { user: true } } },
    { method: 'post', path: 'progress/abort', controller: progress, meta: { auth: { user: true } } },
    { method: 'post', path: 'progress/delete', controller: progress, meta: { auth: { user: true } } },
  ];
  return routes;
};
