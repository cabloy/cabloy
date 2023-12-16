const routes = require('./routes.js');
const services = require('./services.js');
const models = require('./models.js');
const config = require('./config/config.js');
const locales = require('./config/locales.js');
const errors = require('./config/errors.js');
const meta = require('./meta.js');

const beans = require('./beans.js');
const controllers = require('./controllers.js');
module.exports = {
  beans,
  routes,
  controllers,
  services,
  models,
  config,
  locales,
  errors,
  meta,
};
