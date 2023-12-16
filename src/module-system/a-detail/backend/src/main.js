const config = require('./config/config.js');
const locales = require('./config/locales.js');
const errors = require('./config/errors.js');

module.exports = app => {
  const beans = require('./beans.js');
  const routes = require('./routes.js');
  const controllers = require('./controllers.js');
  const services = require('./services.js');
  // models
  const models = require('./models.js')(app);
  // constants
  const constants = require('./config/constants.js')(app);
  // meta
  const meta = require('./meta.js')(app);

  return {
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
};
