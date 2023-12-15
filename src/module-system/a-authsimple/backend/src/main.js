const routes = require('./routes.js');
const services = require('./services.js');
const models = require('./models.js');
const config = require('./config/config.js');
const locales = require('./config/locales.js');
const errors = require('./config/errors.js');
const metaFn = require('./meta.js');

module.exports = app => {
  const beans = require('./beans.js');
  // controllers
  const controllers = require('./controllers.js')(app);
  return {
    beans,
    routes,
    controllers,
    services,
    models,
    config,
    locales,
    errors,
    meta: metaFn(app),
  };
};
