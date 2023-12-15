module.exports = [
  // file
  { method: 'post', path: 'file/upload', controller: 'file', meta: { auth: { user: true } } },
  { method: 'post', path: 'file/uploadDataUrl', controller: 'file', meta: { auth: { user: true } } },
  { method: 'get', path: 'file/download/:downloadId', controller: 'file', action: 'download' },
  { method: 'post', path: 'file/list', controller: 'file' },
  { method: 'post', path: 'file/update', controller: 'file' },
  { method: 'post', path: 'file/delete', controller: 'file', middlewares: 'transaction' },
  { method: 'post', path: 'file/all', controller: 'file' },
];
