const version = require('./controller/version.js');
const sequence = require('./controller/sequence.js');

module.exports = app => {
  const routes = [
    { method: 'post', path: 'version/update', controller: 'version', middlewares: 'inner' },
    { method: 'post', path: 'sequence/next', controller: 'sequence', middlewares: 'inner', meta: { auth: { enable: false } } },
  ];
  return routes;
};
