const routes = require('./routes.js');
const services = require('./services.js');
const config = require('./config/config.js');
const locales = require('./config/locales.js');
const errors = require('./config/errors.js');

// eslint-disable-next-line
module.exports = app => {
  const controllers = require('./controllers.js');
  return {
    routes,
    controllers,
    services,
    config,
    locales,
    errors,
  };
};
