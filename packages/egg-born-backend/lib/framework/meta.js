const MetaClassFn = require('./metaClass.js');
const MetaUtilFn = require('./util.js');
const MetaEnvFn = require('../module/metaEnv.js');

module.exports = function (app) {
  // meta
  const meta = {};

  // class
  meta.class = MetaClassFn();

  // util
  meta.util = MetaUtilFn();

  // env
  MetaEnvFn(app, meta);

  // meta
  return meta;
};
