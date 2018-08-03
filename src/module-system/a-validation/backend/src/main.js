const services = require('./services.js');
const models = require('./models.js');
const config = require('./config/config.js');
const locales = require('./config/locales.js');
const errors = require('./config/errors.js');
const middlewares = require('./config/middlewares.js');
const constants = require('./config/constants.js');
const ajv = require('./ajv/ajv.js');

// eslint-disable-next-line
module.exports = app => {

  // meta
  const meta = require('./meta.js')(app);
  const routes = require('./routes.js')(app);

  // ajv
  app.meta.ajv = ajv;

  return {
    routes,
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
