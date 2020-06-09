const crypto = require('crypto');
const require3 = require('require3');
const bb = require3('bluebird');
const xml2js = require3('xml2js');

module.exports = {
  createNonceStr() {
    return Math.random().toString(36).substr(2, 15);
  },
  createTimestamp() {
    return '' + Math.floor(Date.now() / 1000);
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
