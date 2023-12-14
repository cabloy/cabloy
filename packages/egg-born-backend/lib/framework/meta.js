const MetaClassFn = require('./metaClass.js');
const MetaUtilFn = require('./util.js');

module.exports = function () {
  // meta
  const meta = {};

  // class
  meta.class = MetaClassFn();

  // util
  meta.util = MetaUtilFn();

  // meta
  return meta;
};
