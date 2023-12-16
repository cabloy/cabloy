const DebugInstance = require('debug');

const __debug_caches = {};

// const moduleInfo = module.info;
module.exports = app => {
  class Debug {
    get instance() {
      return DebugInstance;
    }

    get(namespace) {
      if (!__debug_caches[namespace]) {
        __debug_caches[namespace] = DebugInstance(namespace);
      }
      return __debug_caches[namespace];
    }
  }
  return Debug;
};
