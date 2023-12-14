const MetaClassFn = require('./metaClass.js');

module.exports = function (_module) {
  // meta
  if (!_module.meta) _module.meta = {};
  const meta = _module.meta;

  // class
  meta.class = MetaClassFn();

  // meta
  return meta;
};
