const services = require('./services.js');
const models = require('./models.js');
const config = require('./config/config.js');
const locales = require('./config/locales.js');
const errors = require('./config/errors.js');
const constants = require('./config/constants.js');

// eslint-disable-next-line
module.exports = app => {
  const beans = require('./beans.js');
  // meta
  const meta = require('./meta.js')(app);
  const routes = require('./routes.js');
  const controllers = require('./controllers.js');

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
