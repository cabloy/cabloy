const uuid = require('uuid');
const utilFn = require('../utils/util.js');
const ModelClass = require('../base/model.js');
const BeanBaseClass = require('./bean/beanBase.js');
const BeanModuleBaseClass = require('./bean/beanModuleBase.js');
const reloadFn = require('./reload.js');
const mockUtilFn = require('../utils/mockUtil.js');

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
  meta.mockUtil = mockUtilFn(loader.app);

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
