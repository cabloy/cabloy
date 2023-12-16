const config = require('./config/config.js');
const locales = require('./config/locales.js');
const errors = require('./config/errors.js');
const FlowServiceBase = require('./common/flowServiceBase.js');
const aops = require('./aops.js');

// FlowServiceBase
module.meta.class.FlowServiceBase = FlowServiceBase;

module.exports = app => {
  const beans = require('./beans.js');
  const routes = require('./routes.js');
  const controllers = require('./controllers.js');
  const services = require('./services.js');
  const models = require('./models.js');
  // meta
  const meta = require('./meta.js');

  return {
    aops,
    beans,
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
