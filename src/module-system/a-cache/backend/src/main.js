const services = require('./services.js');
const config = require('./config/config.js');
const locales = require('./config/locales.js');
const errors = require('./config/errors.js');

// eslint-disable-next-line
module.exports = app => {
  const beans = require('./beans.js');
  // routes
  const routes = require('./routes.js')(app);
  // controllers
  const controllers = require('./controllers.js')(app);

  return {
    beans,
    routes,
    controllers,
    services,
    config,
    locales,
    errors,
  };
};
