const routes = require('./routes.js');
const services = require('./services.js');
const config = require('./config/config.js');
const locales = require('./config/locales.js');
const errors = require('./config/errors.js');
const constants = require('./config/constants.js');

// eslint-disable-next-line
module.exports = app => {
  const beans = require('./beans.js');
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
    constants,
  };
};
