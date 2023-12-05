const debug = require('debug');

const __debug_caches = {};

module.exports = app => {
  // const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Debug {
    get(namespace) {
      if (!__debug_caches[namespace]) {
        __debug_caches[namespace] = debug(namespace);
      }
      return __debug_caches[namespace];
    }

    instance() {
      return debug;
    }
  }
  return Debug;
};
