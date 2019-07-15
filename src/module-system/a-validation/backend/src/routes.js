const validation = require('./controller/validation.js');

module.exports = app => {
  const routes = [
    { method: 'post', path: 'validation/schema', controller: validation },
  ];
  return routes;
};
