const config = require('./config/config.js');
const locales = require('./config/locales.js');
const errors = require('./config/errors.js');
const aops = require('./aops.js');

module.exports = app => {
  const beans = require('./beans.js');
  const routes = require('./routes.js');
  const controllers = require('./controllers.js');
  const services = require('./services.js');
  // models
  const models = require('./models.js')(app);
  // meta
  const meta = require('./meta.js')(app);
  // /// hook
  // const hook = require('./hook.js')(app);

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
    // hook,
  };
};
