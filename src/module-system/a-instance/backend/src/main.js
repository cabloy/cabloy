const routes = require('./routes.js');
const services = require('./services.js');
const config = require('./config/config.js');
const locales = require('./config/locales.js');
const errors = require('./config/errors.js');

// eslint-disable-next-line
module.exports = app => {
  const beans = require('./beans.js');
  const models = require('./models.js');
  // meta
  const meta = require('./meta.js')(app);
  const controllers = require('./controllers.js');

  return {
    beans,
    routes,
    controllers,
    services,
    config,
    locales,
    errors,
    models,
    meta,
  };
};
