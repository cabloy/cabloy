const path = require('path');
const require3 = require('require3');
const mparse = require3('egg-born-mparse').default;

let __bodyCryptoInstance = null;

module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class BodyCrypto {
    get configModule() {
      return ctx.config.module(moduleInfo.relativeName);
    }

    async ensureBodyCrypto() {
      if (!__bodyCryptoInstance) {
        const configCryptoJS = this.configModule.securityLevelProtection.body.cryptojs;
        const moduleInfo = mparse.parseInfo(configCryptoJS);
        if (!moduleInfo) throw new Error(`Invalid BodyCrypto JS: ${configCryptoJS}`);
        const _module = ctx.app.meta.modules[moduleInfo.relativeName];
        if (!_module) throw new Error(`Module Not Found: ${module}`);
        let jsFile = path.join(_module.static.backend, configCryptoJS.substring(moduleInfo.url.length + 2));
        if (ctx.app.meta.isProd) {
          jsFile += '.min';
        }
        jsFile += '.js';
        const Loader = require3(jsFile);
        __bodyCryptoInstance = await Loader.createBodyCrypto();
      }
      return __bodyCryptoInstance;
    }

    async decrypt() {
      const body = ctx.request && ctx.request.body;
      if (!body || typeof body !== 'object' || !body.crypto) return;
      // ensure
      const bodyCryptoInstance = await this.ensureBodyCrypto();
      ctx.request.body = bodyCryptoInstance.decrypt(body);
    }

    async encrypt() {
      const configCrypto = this.configModule.securityLevelProtection.body.crypto;
      if (!configCrypto) return;
      if (ctx.ctxCaller) return;
      const body = ctx.response && ctx.response.body;
      if (!body || typeof body !== 'object') return;
      // ensure
      const bodyCryptoInstance = await this.ensureBodyCrypto();
      ctx.response.body = bodyCryptoInstance.encrypt(body);
    }
  }
  return BodyCrypto;
};
