module.exports = app => {
  const routes = [
    // file
    { method: 'post', path: 'file/upload', controller: 'file', meta: { auth: { user: true } } },
    { method: 'get', path: 'file/download/:downloadId', controller: 'file', action: 'download', meta: { auth: { enable: false } } },
    { method: 'post', path: 'file/list', controller: 'file' },
    { method: 'post', path: 'file/update', controller: 'file' },
    { method: 'post', path: 'file/delete', controller: 'file', middlewares: 'transaction' },
    { method: 'post', path: 'file/all', controller: 'file' },
  ];
  return routes;
};
