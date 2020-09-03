const services = require('./services.js');
const config = require('./config/config.js');
const locales = require('./config/locales.js');
const errors = require('./config/errors.js');
const middlewares = require('./config/middlewares.js');

// eslint-disable-next-line
module.exports = app => {

  // routes
  const routes = require('./routes.js')(app);
  // controllers
  const controllers = require('./controllers.js')(app);

  return {
    routes,
    controllers,
    services,
    config,
    locales,
    errors,
    middlewares,
  };

};
