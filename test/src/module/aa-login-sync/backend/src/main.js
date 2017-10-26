const routes = require('./routes.js');
const services = require('./services.js');

// eslint-disable-next-line
module.exports = app => {

  return {
    routes,
    services,
  };

};
