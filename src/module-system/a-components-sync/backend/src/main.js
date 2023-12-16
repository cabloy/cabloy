const routes = require('./routes.js');
const services = require('./services.js');
const config = require('./config/config.js');
const locales = require('./config/locales.js');
const errors = require('./config/errors.js');

// eslint-disable-next-line
const controllers = require('./controllers.js');
module.exports = {
  routes,
  controllers,
  services,
  config,
  locales,
  errors,
};
