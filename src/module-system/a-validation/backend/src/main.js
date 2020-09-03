const services = require('./services.js');
const models = require('./models.js');
const config = require('./config/config.js');
const locales = require('./config/locales.js');
const errors = require('./config/errors.js');
const middlewares = require('./config/middlewares.js');
const constants = require('./config/constants.js');

// eslint-disable-next-line
module.exports = app => {

  // meta
  const meta = require('./meta.js')(app);
  // routes
  const routes = require('./routes.js')(app);
  // controllers
  const controllers = require('./controllers.js')(app);

  // ajv
  app.meta.ajv = require('./ajv/ajv.js')(app);

  return {
    routes,
    controllers,
    services,
    models,
    config,
    locales,
    errors,
    middlewares,
    constants,
    meta,
  };

};
