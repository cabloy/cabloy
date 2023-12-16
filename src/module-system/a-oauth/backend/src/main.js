const config = require('./config/config.js');
const locales = require('./config/locales.js');
const errors = require('./config/errors.js');
const aops = require('./aops.js');

const beans = require('./beans.js');
const routes = require('./routes.js');
const controllers = require('./controllers.js');
const services = require('./services.js');
const models = require('./models.js');
// meta
const meta = require('./meta.js');

const moduleInfo = module.info;
module.exports = class Main {
  get options() {
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
  }

  moduleLoaded(/* { module }*/) {
    if (this.app.meta.inApp) {
      // sessionStore
      // this.app.sessionStore = this.app.bean._getBean(`${moduleInfo.relativeName}.local.sessionStore`);
    }
  }
};
