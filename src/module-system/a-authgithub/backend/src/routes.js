module.exports = [
  { method: 'post', path: 'version/update', controller: 'version', middlewares: 'inner' },
  { method: 'post', path: 'version/init', controller: 'version', middlewares: 'inner' },
];
