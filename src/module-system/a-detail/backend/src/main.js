const config = require('./config/config.js');
const locales = require('./config/locales.js');
const errors = require('./config/errors.js');

const beans = require('./beans.js');
const routes = require('./routes.js');
const controllers = require('./controllers.js');
const services = require('./services.js');
const models = require('./models.js');
const constants = require('./config/constants.js');
// meta
const meta = require('./meta.js');

module.exports = {
  beans,
  routes,
  controllers,
  services,
  models,
  config,
  locales,
  errors,
  constants,
  meta,
};
