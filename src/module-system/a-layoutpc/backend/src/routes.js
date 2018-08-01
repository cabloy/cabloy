const version = require('./controller/version.js');

module.exports = [
  { method: 'post', path: 'version/update', controller: version, middlewares: 'inner' },
];
