const config = require('./config/config.js');
const locales = require('./config/locales.js');
const errors = require('./config/errors.js');

module.exports = app => {
  const routes = require('./routes.js');
  const controllers = require('./controllers.js');
  // services
  const services = require('./services.js')(app);
  // models
  const models = require('./models.js')(app);
  // meta
  const meta = require('./meta.js')(app);

  return {
    routes,
    controllers,
    services,
    models,
    config,
    locales,
    errors,
    meta,
  };
};
