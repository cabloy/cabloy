const require3 = require('require3');
const DingTalkEncryptor = require3('dingtalk-encrypt');

module.exports = app => {
  class CallbackController extends app.Controller {

    async index() {
      await this._handleMessage('selfBuilt', async ({ message }) => {
        return await this.ctx.service.callback.index({ message });
      });
    }

    async registerList() {
      await this.ctx.service.callback.registerList();
      this.ctx.success();
    }

    async _handleMessage(appName, handler) {
      // query
      const query = this.ctx.query;
      // config
      const config = this.ctx.config.account.dingtalk;
      const configApp = config.apps[appName];
      // dingtalk crypto
      const encryptor = new DingTalkEncryptor(configApp.businessCallback.token, configApp.businessCallback.encodingAESKey, config.corpid);
      // parse
      const messageIn = await this._parseMessagePost({ query, encryptor });
      console.log(messageIn);
      // handle
      let resXML;
      const messageOut = await handler({ message: messageIn });
      if (!messageOut) {
        resXML = '';
      } else {
        resXML = wechatUtils.buildXML({ xml: messageOut });
        if (encrypted) {
          const wrap = {};
          wrap.Encrypt = wechatCrypto.encrypt(resXML);
          wrap.TimeStamp = wechatUtils.createTimestamp();
          wrap.Nonce = wechatUtils.createNonceStr();
          wrap.MsgSignature = wechatCrypto.getSignature(wrap.TimeStamp, wrap.Nonce, wrap.Encrypt);
          resXML = wechatUtils.buildXML({ xml: wrap });
        }
      }
      // ok
      this.ctx.status = 200;
      this.ctx.type = 'text/xml';
      this.ctx.body = resXML;
    }

    async _parseMessagePost({ query, encryptor }) {
      const plainText = encryptor.getDecryptMsg(
        query.signature, query.timestamp, query.nonce,
        this.ctx.request.body.encrypt);
      console.log('DEBUG plainText: ' + plainText);
      return JSON.parse(plainText);
    }

  }
  return CallbackController;
};

