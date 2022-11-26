const require3 = require('require3');
const cryptojs = require3('crypto-js');

module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class ClassCrypto {
    get configModule() {
      return ctx.config.module(moduleInfo.relativeName);
    }

    async bodyDecrypt() {
      const body = ctx.request && ctx.request.body;
      if (!body || typeof body !== 'object' || !body.crypto) return;
      // key
      let key = this.generateKey();
      key = cryptojs.enc.Utf8.parse(key);
      // decrypt
      const bytes = cryptojs.AES.decrypt(body.data, key, {
        mode: cryptojs.mode.ECB,
        padding: cryptojs.pad.Pkcs7,
      });
      const originalText = bytes.toString(cryptojs.enc.Utf8);
      // ok
      ctx.request.body = JSON.parse(originalText);
    }

    async bodyEncrypt() {
      const configCrypto = this.configModule.securityLevelProtection.body.crypto;
      if (!configCrypto) return;
      const body = ctx.response && ctx.response.body;
      if (!body || typeof body !== 'object') return;
      // key
      let key = this.generateKey();
      key = cryptojs.enc.Utf8.parse(key);
      // src
      const bodySrc = cryptojs.enc.Utf8.parse(JSON.stringify(body));
      const encrypted = cryptojs.AES.encrypt(bodySrc, key, {
        mode: cryptojs.mode.ECB,
        padding: cryptojs.pad.Pkcs7,
      }).toString();
      // ok
      ctx.response.body = {
        crypto: true,
        data: encrypted,
      };
    }

    generateKey() {
      const key = '_cabloy_' + ctx.bean.util.formatDate();
      return cryptojs.SHA1(key).toString().substring(0, 16);
    }
  }
  return ClassCrypto;
};
