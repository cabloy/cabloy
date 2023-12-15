const config = require('./config/config.js');
const locales = require('./config/locales.js');
const errors = require('./config/errors.js');
const CliBase = require('./bean/bean.cliBase.js');
const aops = require('./aops.js');

// base
module.meta.class.CliBase = CliBase;

module.exports = app => {
  const beans = require('./beans.js');
  const routes = require('./routes.js');
  const controllers = require('./controllers.js');
  // services
  const services = require('./services.js')(app);
  // models
  const models = require('./models.js')(app);
  // meta
  const meta = require('./meta.js')(app);

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
