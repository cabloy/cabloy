const config = require('./config/config.js');
const locales = require('./config/locales.js');
const errors = require('./config/errors.js');
const WatcherFn = require('./common/watcher.js');
const AtomCmsBase = require('./common/atomCmsBase.js');

// atomCmsBase
module.meta.class.AtomCmsBase = AtomCmsBase;

module.exports = app => {
  // watcher: only in development
  if (app.meta.isLocal) {
    app.meta['a-cms:watcher'] = new (WatcherFn(app))();
  }

  // beans
  const beans = require('./beans.js')(app);
  // routes
  const routes = require('./routes.js')(app);
  // controllers
  const controllers = require('./controllers.js')(app);
  // services
  const services = require('./services.js')(app);
  // models
  const models = require('./models.js')(app);
  // meta
  const meta = require('./meta.js')(app);

  return {
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
