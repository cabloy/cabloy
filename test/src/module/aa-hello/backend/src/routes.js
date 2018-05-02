const home = require('./controller/home.js');
const version = require('./controller/version.js');

module.exports = [
  // one
  { method: 'get', path: 'home/index', controller: home },
  // same as one
  { method: 'get', path: 'home', controller: home, action: 'index' },
  { method: 'post', path: 'version/update', controller: version, middlewares: 'inner' },
];
