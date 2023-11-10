const uuid = require('uuid');
const mparse = require('egg-born-mparse').default;
const utilFn = require('./util.js');
const ModelClass = require('../base/model.js');
const BeanBaseClass = require('./bean/beanBase.js');
const BeanModuleBaseClass = require('./bean/beanModuleBase.js');
const reloadFn = require('./reload.js');

module.exports = function (loader) {
  // meta
  if (!loader.app.meta) loader.app.meta = {};
  const meta = loader.app.meta;

  // workerId
  meta.workerId = uuid.v4();

  // app or agent
  meta.inApp = loader.app.type === 'application';
  meta.inAgent = loader.app.type === 'agent';

  // isProd
  meta.isProd =
    loader.app.config.env !== 'local' && loader.app.config.env !== 'unittest' && loader.app.config.env !== 'test';
  // isTest
  meta.isTest = loader.app.config.env === 'unittest' || loader.app.config.env === 'test';
  // isLocal
  meta.isLocal = loader.app.config.env === 'local';

  // util
  meta.util = utilFn(loader.app);

  // mockUtil
  meta.mockUtil = createMockUtil(loader.app);

  // model
  meta.Model = ModelClass(loader.app);

  // BeanBase
  meta.BeanBase = BeanBaseClass;

  // BeanModuleBase
  meta.BeanModuleBase = BeanModuleBaseClass;

  // reload
  meta.reload = reloadFn(loader.app);

  // meta
  return meta;
};

function createMockUtil(app) {
  return {
    parseUrlFromPackage(dir, apiPrefix = true) {
      apiPrefix = _prepareApiPrefix(apiPrefix);
      const moduleInfo = this.parseInfoFromPackage(dir);
      if (!moduleInfo) return null;
      return `${apiPrefix}/${moduleInfo.pid}/${moduleInfo.name}`;
    },
    parseInfoFromPackage(dir) {
      const file = app.meta.util.lookupPackage(dir);
      if (!file) return null;
      const pkg = require(file);
      return mparse.parseInfo(mparse.parseName(pkg.name));
    },
    mockUrl(dir, url, apiPrefix = true) {
      apiPrefix = _prepareApiPrefix(apiPrefix);
      if (url && url.charAt(0) === '/') return `${apiPrefix}${url}`;
      const prefix = this.parseUrlFromPackage(dir, apiPrefix);
      return url ? `${prefix}/${url}` : `${prefix}/`;
    },
  };
}

function _prepareApiPrefix(apiPrefix) {
  if (typeof apiPrefix === 'string') return apiPrefix;
  return apiPrefix ? '/api' : '';
}
