const require3 = require('require3');
const WechatCrypto = require3('wechat-crypto');

module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class MessageMiniController extends app.Controller {
    get localUtils() {
      return this.ctx.bean.local.utils;
    }

    async index() {
      // providerScene
      let providerScene = this.ctx.params.providerScene || 'default';
      // compatible with the old 'index'
      if (providerScene === 'index') providerScene = 'default';
      // query
      const query = this.ctx.query;
      // bean provider
      const beanProvider = this.ctx.bean.authProvider.createAuthProviderBean({
        module: moduleInfo.relativeName,
        providerName: 'wechatmini',
        providerScene,
      });
      if (!beanProvider.providerSceneValid) this.ctx.throw(423);
      // config
      const config = beanProvider.configProviderScene;
      // encrypted
      const encrypted = query.encrypt_type === 'aes';
      // wechat crypto
      const wechatCrypto = encrypted
        ? new WechatCrypto(config.message.token, config.message.encodingAESKey, config.appID)
        : null;
      // parse
      let messageIn;
      if (this.ctx.method === 'GET') {
        messageIn = await this._parseMessageGet({ query, config, encrypted, wechatCrypto });
        // ok
        this.ctx.status = 200;
        this.ctx.type = 'text/plain';
        this.ctx.body = messageIn.echostr;
      } else {
        messageIn = await this._parseMessagePost({ query, config, encrypted, wechatCrypto });
        // handle
        await this.ctx.service.messageMini.index({ providerScene, message: messageIn, config, beanProvider });
        // ok
        this.ctx.status = 200;
        this.ctx.type = 'text/plain';
        this.ctx.body = '';
      }
    }

    async _parseMessageGet({ query, config, encrypted, wechatCrypto }) {
      // check if valid
      let valid = false;
      if (encrypted) {
        valid = query.msg_signature === wechatCrypto.getSignature(query.timestamp, query.nonce, query.echostr);
      } else {
        valid =
          query.signature ===
          this.localUtils.calcSignature({ options: [config.message.token, query.timestamp, query.nonce].sort() });
      }
      if (!valid) this.ctx.throw(401);
      // decrypt
      if (encrypted) {
        const res = wechatCrypto.decrypt(query.echostr);
        return { echostr: res.message };
      }
      return { echostr: query.echostr };
    }

    async _parseMessagePost({ query, config, encrypted, wechatCrypto }) {
      let messageIn = this.ctx.request.body;
      // check if valid
      let valid = false;
      if (encrypted) {
        valid = query.msg_signature === wechatCrypto.getSignature(query.timestamp, query.nonce, messageIn.Encrypt);
      } else {
        valid =
          query.signature ===
          this.localUtils.calcSignature({ options: [config.message.token, query.timestamp, query.nonce].sort() });
      }
      if (!valid) this.ctx.throw(401);
      // decrypt
      if (encrypted) {
        const res = wechatCrypto.decrypt(messageIn.Encrypt);
        messageIn = JSON.parse(res.message);
      }
      return messageIn;
    }
  }
  return MessageMiniController;
};
