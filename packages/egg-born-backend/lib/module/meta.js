const uuid = require('uuid');
const utilFn = require('../utils/util.js');
const mockUtilFn = require('../utils/mockUtil.js');
const reloadFn = require('./reload.js');
const metaEnvFn = require('./metaEnv.js');

module.exports = function (loader) {
  // meta
  if (!loader.app.meta) loader.app.meta = {};
  const meta = loader.app.meta;

  // workerId
  meta.workerId = uuid.v4();

  // app or agent
  meta.inApp = loader.app.type === 'application';
  meta.inAgent = loader.app.type === 'agent';

  // env
  metaEnvFn(loader.app, meta);

  // util
  meta.util = utilFn(loader.app);

  // mockUtil
  meta.mockUtil = mockUtilFn(loader.app);

  // reload
  meta.reload = reloadFn(loader.app);

  // meta
  return meta;
};
