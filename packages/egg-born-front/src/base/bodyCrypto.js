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
    decrypt(response) {
      const body = response && response.data;
      if (!body || typeof body !== 'object' || !body.crypto) return;
      if (!__bodyCryptoInstance) return;
      response.data = __bodyCryptoInstance.decrypt(body);
    },
    encrypt(config) {
      const body = config.data;
      if (!body || typeof body !== 'object') return;
      if (!__bodyCryptoInstance) return;
      config.data = __bodyCryptoInstance.encrypt(body);
    },
  };
}
