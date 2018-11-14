const version = require('./controller/version.js');
const file = require('./controller/file.js');

module.exports = app => {
  const routes = [
    // version
    { method: 'post', path: 'version/update', controller: version, middlewares: 'inner' },
    { method: 'post', path: 'version/init', controller: version, middlewares: 'inner' },
    { method: 'post', path: 'version/test', controller: version, middlewares: 'test' },
    // file
    { method: 'post', path: 'file/upload', controller: file, meta: { auth: { user: true } } },
    { method: 'get', path: 'file/download/:downloadId', controller: file, action: 'download' },
    { method: 'post', path: 'file/list', controller: file,
      meta: { right: { type: 'atom', action: 2 } },
    },
    { method: 'post', path: 'file/delete', controller: file, middlewares: 'transaction',
      meta: { right: { type: 'atom', action: 3 } },
    },
  ];
  return routes;
};
