let __bodyCryptoInstance = null;

export default function (Vue) {
  return {
    async createBodyCrypto() {
      if (__bodyCryptoInstance) return __bodyCryptoInstance;
      const configBase = Vue.prototype.$meta.config.modules['a-base'];
      if (!configBase.securityLevelProtection.body.crypto) return null;
      return new Promise(resolve => {
        const jsFile = `api/static${configBase.securityLevelProtection.body.cryptojs}`;
        Vue.prototype.$meta.util.requirejs.require([jsFile], function (Loader) {
          Loader.createBodyCrypto().then(bodyCryptoInstance => {
            __bodyCryptoInstance = bodyCryptoInstance;
            resolve(__bodyCryptoInstance);
          });
        });
      });
    },
    getBodyCrypto() {
      return __bodyCryptoInstance;
    },
  };
}
