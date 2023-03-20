const CacheBase = require('../common/cacheBase.js');

module.exports = ctx => {
  class LocalFetch extends CacheBase(ctx) {
    constructor({ cacheBase }) {
      super({ cacheBase });
    }
  }

  return LocalFetch;
};
