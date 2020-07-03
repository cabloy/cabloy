const require3 = require('require3');
const DingTalkEncryptor = require3('dingtalk-encrypt');
const dingtalkUtils = require('../common/dingtalkUtils.js');

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
      const message = await this._parseMessagePost({ query, encryptor });
      // handle
      await handler({ message });
      // ok
      const res = encryptor.getEncryptedMap('success', dingtalkUtils.createTimestamp(), dingtalkUtils.createNonceStr());
      this.ctx.status = 200;
      this.ctx.type = 'application/json';
      this.ctx.body = res;
    }

    async _parseMessagePost({ query, encryptor }) {
      const plainText = encryptor.getDecryptMsg(
        query.signature, query.timestamp, query.nonce,
        this.ctx.request.body.encrypt);
      return JSON.parse(plainText);
    }

  }
  return CallbackController;
};

