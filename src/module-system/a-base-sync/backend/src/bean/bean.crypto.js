const cryptojs = require('crypto');

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
      const key = this.generateKey();
      // decrypt
      const decipher = cryptojs.createDecipheriv('aes-128-ECB', key, '');
      let dec = decipher.update(body.data, 'hex', 'utf8');
      dec += decipher.final('utf8');
      ctx.request.body = JSON.parse(dec);
    }

    async bodyEncrypt() {
      const configCrypto = this.configModule.configFront.body.crypto;
      if (!configCrypto) return;
      const body = ctx.response && ctx.response.body;
      if (!body || typeof body !== 'object') return;
      // key
      const key = this.generateKey();
      // src
      const cipher = cryptojs.createCipheriv('aes-128-ECB', key, '');
      let enc = cipher.update(JSON.stringify(body), 'utf8', 'hex');
      enc += cipher.final('hex');
      ctx.response.body = {
        crypto: true,
        data: enc,
      };
    }

    generateKey() {
      const keySrc = '_cabloy_' + ctx.bean.util.formatDate();
      const hashsum = cryptojs.createHash('sha1');
      hashsum.update(keySrc);
      return hashsum.digest('hex').substring(0, 16);
    }
  }
  return ClassCrypto;
};
