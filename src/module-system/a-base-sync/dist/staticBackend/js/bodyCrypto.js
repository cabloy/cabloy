(function (global, factory) {
  /* eslint-disable */
  typeof exports === 'object' && typeof module !== 'undefined'
    ? (module.exports = factory())
    : typeof define === 'function' && define.amd
    ? define(factory)
    : null;
  /* eslint-enable */
})(this, function () {
  function __createBodyCrypto(CryptoJS) {
    return {
      encrypt(body) {
        if (!body || typeof body !== 'object') return body;
        // key
        let key = this.generateKey();
        key = CryptoJS.enc.Utf8.parse(key);
        // src
        const bodySrc = CryptoJS.enc.Utf8.parse(JSON.stringify(body));
        const encrypted = CryptoJS.AES.encrypt(bodySrc, key, {
          mode: CryptoJS.mode.ECB,
          padding: CryptoJS.pad.Pkcs7,
        }).toString();
        // ok
        return {
          crypto: true,
          data: encrypted,
        };
      },

      decrypt(body) {
        if (!body || typeof body !== 'object' || !body.crypto) return body;
        // key
        let key = this.generateKey();
        key = CryptoJS.enc.Utf8.parse(key);
        // decrypt
        const bytes = CryptoJS.AES.decrypt(body.data, key, {
          mode: CryptoJS.mode.ECB,
          padding: CryptoJS.pad.Pkcs7,
        });
        const originalText = bytes.toString(CryptoJS.enc.Utf8);
        // ok
        return JSON.parse(originalText);
      },

      generateKey() {
        const date = new Date();
        const parts = [date.getFullYear(), date.getMonth() + 1, date.getDate()];
        const key = '_cabloy_' + parts.join('-');
        return CryptoJS.SHA1(key).toString().substring(0, 16);
      },
    };
  }

  return {
    async createBodyCrypto() {
      if (typeof exports === 'object' && typeof module !== 'undefined') {
        const CryptoJS = require('../vendor/crypto-js/crypto-js.js');
        return __createBodyCrypto(CryptoJS);
      }
      return new Promise(resolve => {
        require.config({
          paths: {
            'crypto-js': 'api/static/a/base/vendor/crypto-js/crypto-js',
          },
        });
        require(['crypto-js'], function (CryptoJS) {
          resolve(__createBodyCrypto(CryptoJS));
        });
      });
    },
  };
});
