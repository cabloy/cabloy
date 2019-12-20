const crypto = require('crypto');
const require3 = require('require3');
const bb = require3('bluebird');
const xml2js = require3('xml2js');

module.exports = {
  // // todo:
  // createWechatApi({ ctx }) {
  //   const configWechat = ctx.config.module('iotcabinet-wechat');
  //   // api
  //   const api = new WechatAPI(configWechat.wechat.appID, configWechat.wechat.appSecret,
  //     async function() {
  //       const name = 'wechat-api';
  //       return await ctx.cache.db.get(name);
  //     },
  //     async function(token) {
  //       const name = 'wechat-api';
  //       await ctx.cache.db.set(name, token, 1000 * 3600 * 1.5);
  //     });
  //   // ok
  //   return api;
  // },
  createNonce() {
    return Math.random().toString(36).substr(2, 15);
  },
  createTimeStamp() {
    return parseInt(new Date().getTime() / 1000) + '';
  },
  calcSignature({ options, join = '', hash = 'sha1' }) {
    const hashsum = crypto.createHash(hash);
    hashsum.update(options.join(join));
    return hashsum.digest('hex');
  },
  async parseXML({ xml, trim = true, explicitArray = false, explicitRoot = false }) {
    const parser = new xml2js.Parser({ trim, explicitArray, explicitRoot });
    return await bb.fromCallback(cb => {
      parser.parseString(xml, cb);
    });
  },
  buildXML({ xml, cdata = true, headless = true, rootName = 'xml' }) {
    return (new xml2js.Builder({ cdata, headless, rootName })).buildObject(xml);
  },

};
