const MetaClassFn = require('./metaClass.js');

module.exports = function () {
  // meta
  const meta = {};

  // class
  meta.class = MetaClassFn();

  // meta
  return meta;
};
