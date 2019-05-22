const utils = require('../common/utils.js');

module.exports = app => {

  class Captcha extends app.Service {

    async getProvider() {
      // timeout
      const timeout = this.ctx.config.cache.timeout;
      // provider
      const provider = this.ctx.config.provider;
      // cache
      const key = utils.getCacheKey({ ctx: this.ctx });
      await this.ctx.cache.db.set(key, { provider }, timeout);
      // ok
      return { provider };
    }

  }

  return Captcha;
};
