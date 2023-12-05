const debug = require('debug');

module.exports = app => {
  // const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Debug {
    create(namespace) {
      return debug(namespace);
    }

    instance() {
      return debug;
    }
  }
  return Debug;
};
