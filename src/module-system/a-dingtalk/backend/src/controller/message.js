const require3 = require('require3');
const DingTalkEncryptor = require3('dingtalk-encrypt');

module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class MessageController extends app.Controller {
    get localUtils() {
      return this.ctx.bean.local.utils;
    }

    async index() {
      // providerName
      const providerName = this.ctx.params.providerName;
      // providerScene
      let providerScene = this.ctx.params.providerScene || 'selfBuilt';
      // compatible with the old 'index'
      if (providerScene === 'index') providerScene = 'selfBuilt';
      // bean provider
      const beanProvider = this.ctx.bean.authProvider.createAuthProviderBean({
        module: moduleInfo.relativeName,
        providerName,
        providerScene,
      });
      if (!beanProvider.providerSceneValid) this.ctx.throw(423);
      // handle message
      await this._handleMessage(beanProvider, async ({ message }) => {
        return await this.ctx.service.message.general({ beanProvider, message });
      });
    }

    async _handleMessage(beanProvider, handler) {
      // query
      const query = this.ctx.query;
      // config
      const config = beanProvider.configProviderScene;
      // dingtalk crypto
      const encryptor = new DingTalkEncryptor(config.message.token, config.message.encodingAESKey, config.appKey);
      // parse
      const message = await this._parseMessagePost({ query, encryptor });
      // handle
      await handler({ message });
      // ok
      const res = encryptor.getEncryptedMap(
        'success',
        this.localUtils.createTimestamp(),
        this.localUtils.createNonceStr()
      );
      this.ctx.status = 200;
      this.ctx.type = 'application/json';
      this.ctx.body = res;
    }

    async _parseMessagePost({ query, encryptor }) {
      const plainText = encryptor.getDecryptMsg(
        query.signature,
        query.timestamp,
        query.nonce,
        this.ctx.request.body.encrypt
      );
      return JSON.parse(plainText);
    }
  }
  return MessageController;
};
