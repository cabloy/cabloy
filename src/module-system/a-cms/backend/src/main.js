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

  const beans = require('./beans.js');
  const routes = require('./routes.js');
  const controllers = require('./controllers.js');
  const services = require('./services.js');
  const models = require('./models.js');
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
