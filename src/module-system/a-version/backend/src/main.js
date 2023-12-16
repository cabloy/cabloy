const routes = require('./routes.js');
const services = require('./services.js');
const config = require('./config/config.js');
const locales = require('./config/locales.js');
const errors = require('./config/errors.js');
const constants = require('./config/constants.js');

// eslint-disable-next-line
const beans = require('./beans.js');
const controllers = require('./controllers.js');

module.exports = {
  beans,
  routes,
  controllers,
  services,
  config,
  locales,
  errors,
  constants,
};
