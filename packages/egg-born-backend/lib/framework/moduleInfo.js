const Module = require('module');
const ModuleInfo = require('@zhennann/module-info');

const originalCompile = Module.prototype._compile;
Module.prototype._compile = function (...args) {
  const _module = this;
  // app
  Object.defineProperty(_module, 'app', {
    enumerable: false,
    get() {
      return app;
    },
  });
  // info
  Object.defineProperty(_module, 'info', {
    enumerable: false,
    get() {
      return ModuleInfo.parseInfoFromPackage(_module.path);
    },
  });
  return originalCompile.apply(_module, args);
};
