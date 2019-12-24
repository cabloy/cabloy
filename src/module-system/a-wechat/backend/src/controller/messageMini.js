const require3 = require('require3');
const WechatCrypto = require3('wechat-crypto');
const wechatUtils = require('../common/wechatUtils.js');

module.exports = app => {
  class MessageMiniController extends app.Controller {

    async index() {

    }

  }
  return MessageMiniController;
};

