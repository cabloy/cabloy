const common = require('./common.js');

const MOCKUTIL = Symbol('Agent#mockUtil');

module.exports = {
  get mockUtil() {
    if (!this[MOCKUTIL]) {
      this[MOCKUTIL] = common.createMockUtil(this);
    }
    return this[MOCKUTIL];
  },
  get isProd() {
    return common.isProd(this);
  },
};
