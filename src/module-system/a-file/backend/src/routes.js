const version = require('./controller/version.js');
const file = require('./controller/file.js');

module.exports = app => {
  const routes = [
    // version
    { method: 'post', path: 'version/update', controller: 'version', middlewares: 'inner' },
    { method: 'post', path: 'version/init', controller: 'version', middlewares: 'inner' },
    { method: 'post', path: 'version/test', controller: 'version', middlewares: 'test' },
    // file
    { method: 'post', path: 'file/uploadInner', controller: 'file', middlewares: 'inner' },
    { method: 'post', path: 'file/upload', controller: 'file', meta: { auth: { user: true } } },
    { method: 'get', path: 'file/download/:downloadId', controller: 'file', action: 'download', meta: { auth: { enable: false } } },
    { method: 'post', path: 'file/list', controller: 'file' },
    { method: 'post', path: 'file/delete', controller: 'file', middlewares: 'transaction' },
    { method: 'get', path: 'file/fileInfo/:downloadId', controller: 'file', action: 'fileInfo', middlewares: 'inner' },
  ];
  return routes;
};
