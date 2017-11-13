const version = require('./controller/version.js');

module.exports = [
  { method: 'post', path: 'version/check', controller: version },
  { method: 'post', path: 'version/updateModule', controller: version, transaction: true },
  { method: 'post', path: 'version/update', controller: version },
  { method: 'get', path: 'version/result', controller: version },
];
